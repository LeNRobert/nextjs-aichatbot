'use client';

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { ChatOptions } from "./chat/chat-options";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export interface CustomDropdownMenuProps {
  modelsList: string[];
  chatOptions: ChatOptions;
  setChatOptions: Dispatch<SetStateAction<ChatOptions>>;
}

export default function ModelMenu ({
  modelsList,
  chatOptions,
  setChatOptions,
}: CustomDropdownMenuProps){
  const [selectedModel, setSelectedModel] = React.useState(chatOptions.selectedModel);

  const handleSelectionChange = (model: any) => {
    setChatOptions({ ...chatOptions, selectedModel: model });
    setSelectedModel(model);
  };

  return (
    <div className="mx-2 flex align-middle gap-4 items-center justify-between pt-3 pb-3">
      <label
        htmlFor="model-change"
        className="text-xs font-medium text-gray-900 dark:text-white align-middle"
      >
        Model
      </label>
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex w-full items-center
        border border-input bg-background hover:text-accent-foreground
        rounded-sm"
        >
        <Button
          id="model-change"
          size="sm"
          variant="outline"
          className="flex w-full items-center
        border border-input bg-background hover:text-accent-foreground
        rounded-sm"
        >
          {selectedModel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
      >
        <DropdownMenuRadioGroup value={selectedModel} onValueChange={handleSelectionChange}>
        {modelsList.map((model) => (
          <DropdownMenuRadioItem  
          value={model}
          >{model}</DropdownMenuRadioItem >
        ))}
        </DropdownMenuRadioGroup> 
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
}
