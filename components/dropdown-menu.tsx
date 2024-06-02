import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import { ChatOptions } from "./chat/chat-options";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Console } from "console";

export interface CustomDropdownMenuProps {
  modelsList: string[];
  chatOptions: ChatOptions;
  setChatOptions: Dispatch<SetStateAction<ChatOptions>>;
}

export default function CustomDropdownMenu ({
  modelsList,
  chatOptions,
  setChatOptions,
}: CustomDropdownMenuProps){
  const [selectedModel, setSelectedModel] = React.useState(chatOptions.selectedModel);

  const handleSelectionChange = (model: any) => {
    setChatOptions({ ...chatOptions, selectedModel: model.currentKey });
    setSelectedModel(model.currentKey);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="capitalize"
        >
          {selectedModel}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedModel}
        onSelectionChange={handleSelectionChange}
      >
        {modelsList.map((model) => (
          <DropdownItem key={model}>{model}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
