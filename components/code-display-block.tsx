"use client";
import React from "react";

import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { CodeBlock, dracula, github, monokai, solarizedDark, solarizedLight, tomorrowNight, nord, atomOneDark, atomOneLight, obsidian, ocean, zenburn } from "react-code-blocks";
import { toast } from "sonner";
import useLocalStorageState from "use-local-storage-state";
import { Button } from "./ui/button";

interface ButtonCodeblockProps {
  code: string;
  lang: string;
}

export default function CodeDisplayBlock({ code, lang }: ButtonCodeblockProps) {
  const [isCopied, setisCopied] = React.useState(false);
  const { theme } = useTheme();
  const [ codeTheme, setCodeTheme ] = useLocalStorageState<{ light: string, dark: string }>(
    "codeTheme",
    {
      defaultValue: { light: "github", dark: "dracula" }
    }
  );

  const codeThemes = [
    { name: "dracula", theme: dracula },
    { name: "github", theme: github },
    { name: "monokai", theme: monokai },
    { name: "solarizedDark", theme: solarizedDark },
    { name: "solarizedLight", theme: solarizedLight },
    { name: "tomorrowNight", theme: tomorrowNight },
    { name: "nord", theme: nord },
    { name: "atomOneDark", theme: atomOneDark },
    { name: "atomOneLight", theme: atomOneLight },
    { name: "obsidian", theme: obsidian },
    { name: "ocean", theme: ocean },
    { name: "zenburn", theme: zenburn },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setisCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => {
      setisCopied(false);
    }, 1500);
  };

  return (
    <div className="relative my-4 flex flex-col text-start w-full">
      <CodeBlock
        customStyle={{
          borderRadius: "8px",
          padding: "12px",
        }}
        text={code}
        language={lang}
        showLineNumbers={false}
        wrapLongLines={true}
        theme={
          theme === "light"
            ? codeThemes.find((theme) => theme.name === codeTheme.light)?.theme
            : codeThemes.find((theme) => theme.name === codeTheme.dark)?.theme
        }
      />
      <Button
        onClick={copyToClipboard}
        variant="ghost"
        size="iconSm"
        className="h-5 w-5 absolute top-2 right-2"
      >
        {isCopied ? (
          <CheckIcon className="w-4 h-4" />
        ) : (
          <CopyIcon className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
