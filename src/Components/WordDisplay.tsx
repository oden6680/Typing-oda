import React from "react";
import { Text, Box, VStack } from "@yamada-ui/react";

interface WordDisplayProps {
  word: string;
  displayRomajiList: string[];
  isMistyped: boolean;
  currentKanaInput: string;
  userInput: string;
}

export const WordDisplay: React.FC<WordDisplayProps> = ({
  word,
  displayRomajiList,
  isMistyped,
  currentKanaInput,
  userInput,
}) => {
  const renderKana = () => {
    return (
      <Box textAlign="center">
        <Text fontSize="4xl" fontWeight="bold" color="black">
          {word}
        </Text>
      </Box>
    );
  };

  const renderRomaji = () => {
    const totalRomaji = displayRomajiList.join("");
    const combinedInput = userInput + currentKanaInput;
    const totalRomajiChars = totalRomaji.split("");
    const combinedInputChars = combinedInput.split("");

    return (
      <Box textAlign="center">
        {totalRomajiChars.map((char, index) => {
          let color = "black";

          if (index < combinedInputChars.length) {
            if (combinedInputChars[index] === char) {
              color = "green";
            } else {
              color = "red";
            }
          } else if (index === combinedInputChars.length && isMistyped) {
            color = "red";
          }

          return (
            <Text
              as="span"
              key={index}
              color={color}
              fontSize="xl"
              fontWeight="bold">
              {char}
            </Text>
          );
        })}
      </Box>
    );
  };

  return (
    <VStack align="center" width="100%">
      {renderKana()}
      {renderRomaji()}
    </VStack>
  );
};
