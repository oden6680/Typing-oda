import React from "react";
import { Input } from "@yamada-ui/react";

interface TypingInputProps {
  value: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const TypingInput: React.FC<TypingInputProps> = ({
  value,
  onKeyDown,
}) => {
  return (
    <Input
      value={value}
      onKeyDown={onKeyDown}
      readOnly
      placeholder="Type the word here..."
    />
  );
};
