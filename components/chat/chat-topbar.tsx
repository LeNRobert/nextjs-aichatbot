"use client";

import React, { useEffect } from "react";

import {
  CheckCircledIcon,
  CrossCircledIcon,
  DotFilledIcon,
  HamburgerMenuIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Message } from "ai/react";
import { toast } from "sonner";
import CustomDropdownMenu from "../dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { encodeChat, tokenLimit } from "@/lib/token-counter";
import { basePath, useHasMounted } from "@/lib/utils";
import { Sidebar } from "../sidebar";
import { ChatOptions } from "./chat-options";

interface ChatTopbarProps {
  chatOptions: ChatOptions;
  setChatOptions: React.Dispatch<React.SetStateAction<ChatOptions>>;
  isLoading: boolean;
  chatId?: string;
  setChatId: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  setModelsList: React.Dispatch<React.SetStateAction<string[]>>;
  modelsList: string[];
}

export default function ChatTopbar({
  chatOptions,
  setChatOptions,
  isLoading,
  chatId,
  setChatId,
  messages,
  setModelsList,
  modelsList,
}: ChatTopbarProps) {
  const hasMounted = useHasMounted();

  const currentModel = chatOptions && chatOptions.selectedModel;

  const fetchData = async () => {
    if (!hasMounted) {
      return null;
    }
    try {
      
      const res = await fetch(basePath + "/api/models");

      if (!res.ok) {
        const errorResponse = await res.json();
        const errorMessage = `Connection to vLLM server failed: ${errorResponse.error} [${res.status} ${res.statusText}]`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setModelsList(data.data.map((model: any) => model.id));

      setChatOptions({ ...chatOptions, selectedModel: 'open-mistral-7b' });
      
    } catch (error) {
      setChatOptions({ ...chatOptions, selectedModel: undefined });
      toast.error(error as string);
    }
  };

  useEffect(() => {
    fetchData();
  }, [hasMounted]);

  if (!hasMounted) {
    return (
      <div className="md:w-full flex px-4 py-6 items-center gap-1 md:justify-center">
        <DotFilledIcon className="w-4 h-4 text-blue-500" />
        <span className="text-xs">Booting up..</span>
      </div>
    );
  }

  const chatTokens = messages.length > 0 ? encodeChat(messages) : 0;

  return (
    <div className="md:w-full flex px-4 py-4 items-center justify-between md:justify-center">
      <Sheet>
        <SheetTrigger>
          <div className="flex items-center gap-2">
            <HamburgerMenuIcon className="md:hidden w-5 h-5" />
          </div>
        </SheetTrigger>
        <SheetContent side="left">
            <Sidebar
              chatId={chatId || ""}
              setChatId={setChatId}
              isCollapsed={false}
              isMobile={false}
              chatOptions={chatOptions}
              setChatOptions={setChatOptions}
              modelsList={modelsList}
            />
        </SheetContent>
      </Sheet>

      <div className="flex justify-center md:justify-between gap-4 w-full">
        <div className="gap-1 flex items-center">
          {currentModel !== undefined && (
            <>
              {isLoading ? (
                <DotFilledIcon className="w-4 h-4 text-blue-500" />
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="cursor-help">
                        <CheckCircledIcon className="w-4 h-4 text-green-500" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      sideOffset={4}
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded-sm text-xs"
                    >
                      <p className="font-bold">Current Model</p>
                      <p className="text-gray-500">{currentModel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <span className="text-xs">
                {isLoading ? "Generating.." : "Ready"}
              </span>
            </>
          )}
          {currentModel === undefined && (
            <>
              <CrossCircledIcon className="w-4 h-4 text-red-500" />
              <span className="text-xs">Connection to vLLM server failed</span>
            </>
          )}
        </div>
        <div className="flex items-end gap-2">
          {chatTokens > tokenLimit && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span>
                    <InfoCircledIcon className="w-4 h-4 text-blue-500" />
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={4}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-sm text-xs"
                >
                  <p className="text-gray-500">
                    Token limit exceeded. Truncating middle messages.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {messages.length > 0 && (
            <span className="text-xs text-gray-500">
              {chatTokens} / {tokenLimit} token{chatTokens > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
