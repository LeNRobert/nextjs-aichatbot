import MistralClient from '@mistralai/mistralai';
import { MistralStream, StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';
import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources/index.mjs";import { encodeChat, tokenLimit } from "@/lib/token-counter";

export const dynamic = 'force-dynamic';

const mistral = new MistralClient(process.env.MISTRAL_API_KEY || '');

const addSystemMessage = (
  messages: ChatCompletionMessageParam[],
  systemPrompt?: string
): ChatCompletionMessageParam[] => {
  // early exit if system prompt is empty
  if (!systemPrompt || systemPrompt === "") {
    return messages;
  }

  // add system prompt to the chat (if it's not already there)
  // check first message in the chat
  if (!messages) {
    // if there are no messages, add the system prompt as the first message
    messages = [
      {
        role: "system",
        content: systemPrompt,
      },
    ];
  } else if (messages.length === 0) {
    // if there are no messages, add the system prompt as the first message
    messages.push({
      role: "system",
      content: systemPrompt
    });
  } else {
    // if there are messages, check if the first message is a system prompt
    if (messages[0].role === "system") {
      // if the first message is a system prompt, update it
      messages[0].content = systemPrompt;
    } else {
      // if the first message is not a system prompt, add the system prompt as the first message
      messages.unshift({
        role: "system",
        content: systemPrompt,
      });
    }
  }
  return messages;
};

const formatMessages = (
  messages: ChatCompletionMessageParam[]
): ChatCompletionMessageParam[] => {
  let mappedMessages: ChatCompletionMessageParam[] = [];
  let messagesTokenCounts: number[] = [];
  const responseTokens = 512;
  const tokenLimitRemaining = tokenLimit - responseTokens;
  let tokenCount = 0;

  messages.forEach((m) => {
    if (m.role === "system") {
      mappedMessages.push({
        role: "system",
        content: m.content,
      } as ChatCompletionSystemMessageParam);
    } else if (m.role === "user") {
      mappedMessages.push({
        role: "user",
        content: m.content,
      } as ChatCompletionUserMessageParam);
    } else if (m.role === "assistant") {
      mappedMessages.push({
        role: "assistant",
        content: m.content,
      } as ChatCompletionAssistantMessageParam);
    } else {
      return;
    }

    // ignore typing
    // tslint:disable-next-line
    const messageTokens = encodeChat([m]); 
    messagesTokenCounts.push(messageTokens);
    tokenCount += messageTokens;
  });

  if (tokenCount <= tokenLimitRemaining) {
    return mappedMessages;
  }

  // remove the middle messages until the token count is below the limit
  while (tokenCount > tokenLimitRemaining) {
    const middleMessageIndex = Math.floor(messages.length / 2);
    const middleMessageTokens = messagesTokenCounts[middleMessageIndex];
    mappedMessages.splice(middleMessageIndex, 1);
    messagesTokenCounts.splice(middleMessageIndex, 1);
    tokenCount -= middleMessageTokens;
  }
  return mappedMessages;
};

export async function POST(req: NextRequest) {
  // Extract the `messages` from the body of the request
  const { messages, chatOptions } = await req.json();

  formatMessages(
    addSystemMessage(messages, chatOptions.systemPrompt)
  );

  const response = mistral.chatStream({
    model: chatOptions.selectedModel,
    temperature: chatOptions.temperature,
    safePrompt: false,
    maxTokens: 1000,
    messages: messages,
  });


  // Convert the response into a friendly text-stream. The Mistral client responses are
  // compatible with the Vercel AI SDK MistralStream adapter.
  const stream = MistralStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
