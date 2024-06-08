"use client";
import React from "react";
import { PaletteIcon } from "lucide-react";

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
import useLocalStorageState from "use-local-storage-state";
import { Button } from "@/components/ui/button";

export interface CodeThemeMenuProps {
}

export default function CodeThemeMenu ({
}: CodeThemeMenuProps){

  const [ codeTheme, setCodeTheme ] = useLocalStorageState<{ light: string, dark: string }>(
    "codeTheme",
    {
      defaultValue: { light: "github", dark: "dracula" }
    }
  );

  const handleLightThemeChange = (value: any) => {
    console.log(value);
    setCodeTheme({ ...codeTheme, light: value });
    console.log(codeTheme);
  };

  const handleDarkThemeChange = (value: any) => {
    setCodeTheme({ ...codeTheme, dark: value });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="justify-start gap-2 w-full"
      >
        <Button
          className="justify-start gap-2 w-full"
          size="sm"
          variant="ghost"
        >
          <PaletteIcon className="w-4 h-4" />
          Code theme 
        </Button>

      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Dark theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={codeTheme.dark} onValueChange={handleDarkThemeChange}>
          <DropdownMenuRadioItem value="dracula">Dracula</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="monokai">Monokai</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="solarizedDark">Solarized Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="tomorrowNight">Tomorrow Night</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="nord">Nord</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="atomOneDark">Atom One Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="obsidian">Obsidian</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ocean">Ocean</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="zenburn">Zenburn</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          Light theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={codeTheme.light} onValueChange={handleLightThemeChange}>
          <DropdownMenuRadioItem value="github">Github</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="solarizedLight">Solarized Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="atomOneLight">Atom One Light</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}