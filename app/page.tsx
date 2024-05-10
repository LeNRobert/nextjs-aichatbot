'use client';

import { useChat } from 'ai/react';
import { toast } from "sonner";
import React, { use } from 'react';
import { v4 as uuidv4 } from "uuid";
import { ChatRequestOptions } from "ai";
import { ChatOptions } from "@/components/chat/chat-options";
import useLocalStorageState from "use-local-storage-state";
import { ChatLayout } from "@/components/chat/chat-layout";


export default function Chat() {
  const [chatId, setChatId] = useLocalStorageState<string>(
    "chat",
    {
      defaultValue: ""
    });

  const { 
    messages,
    input, 
    handleInputChange, 
    handleSubmit,
    isLoading,
    stop,
    error,
    setMessages,
  } = useChat({
    onError: (error) => {
      toast.error("Something went wrong: " + error);
    }
  });

  const [chatOptions, setChatOptions] = useLocalStorageState<ChatOptions>(
    "chatOptions",
    {
      defaultValue: {
        selectedModel: "",
        systemPrompt: "",
        temperature: 0.9,
      },
    }
  );

  React.useEffect(() => {
    if (chatId) {
      const item = localStorage.getItem(`chat_${chatId}`);
      if (item) {
        setMessages(JSON.parse(item));
      }
    } else {
      setMessages([]);
    }
  }, [setMessages, chatId]);

  React.useEffect(() => {
    if (!isLoading && !error && chatId && messages.length > 0) {
      // Save messages to local storage
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
      // Trigger the storage event to update the sidebar component
      window.dispatchEvent(new Event("storage"));
    }
  }, [messages, chatId, isLoading, error]);


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (messages.length === 0) {
      // Generate a random id for the chat
      const id = uuidv4();
      setChatId(id);
    }

    setMessages([...messages]);

    // Prepare the options object with additional body data, to pass the model.
    const requestOptions: ChatRequestOptions = {
      options: {
        body: {
          chatOptions: chatOptions,
        },
      },
    };

    // Call the handleSubmit function with the options
    handleSubmit(e, requestOptions);
  };


  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      <h1 className="text-3xl font-bold text-center mt-4">Chat {chatId}</h1>
      <ChatLayout
        chatId={chatId}
        setChatId={setChatId}
        chatOptions={chatOptions}
        setChatOptions={setChatOptions}
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        stop={stop}
        navCollapsedSize={10}
        defaultLayout={[30, 160]}
      />
    </main>
  );
}
