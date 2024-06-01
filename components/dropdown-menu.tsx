import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

export interface CustomDropdownMenuProps {
  modelsList: string[];
}

export default function CustomDropdownMenu ({
  modelsList,
}: CustomDropdownMenuProps){
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(modelsList[0]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const handleSelectionChange = (key: any) => {
    setSelectedKeys(new Set([key]));
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="capitalize"
        >
          {selectedValue}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      >
        {modelsList.map((model) => (
          <DropdownItem key={model}>{model}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
