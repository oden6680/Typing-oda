/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { VStack, Button, Heading, Text } from "@yamada-ui/react";

interface StartScreenProps {
  onStart: (difficulty: "easy" | "medium" | "hard") => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const difficulties: Array<"easy" | "medium" | "hard"> = [
    "easy",
    "medium",
    "hard",
  ];
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : difficulties.length - 1
          );
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prevIndex) =>
            prevIndex < difficulties.length - 1 ? prevIndex + 1 : 0
          );
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          onStart(difficulties[selectedIndex]);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, onStart, difficulties]);

  const handleDifficultySelect = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <VStack align="center">
      <Heading fontSize="6xl" fontFamily="Gyoshokk">
        織打
      </Heading>
      <VStack>
        {difficulties.map((difficulty, index) => (
          <Button
            key={difficulty}
            onClick={() => handleDifficultySelect(index)}
            variant={selectedIndex === index ? "solid" : "outline"}
            colorScheme={
              difficulty === "easy"
                ? "green"
                : difficulty === "medium"
                ? "blue"
                : "red"
            }>
            {difficulty === "easy" && "小田(簡単)"}
            {difficulty === "medium" && "尾田(普通)"}
            {difficulty === "hard" && "織田(難しい)"}
          </Button>
        ))}
      </VStack>
      <Text>難易度を選択し、スペースキーを押してゲームを開始してください</Text>
    </VStack>
  );
};
