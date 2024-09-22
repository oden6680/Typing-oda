import React from 'react';
import { Text, Box, VStack } from '@yamada-ui/react';

interface WordDisplayProps {
  word: string;
  fullRomaji: string;
  userInput: string;
  isMistyped: boolean;
  inputIndex: number;
}

export const WordDisplay: React.FC<WordDisplayProps> = ({
  word,
  fullRomaji,
  userInput,
  isMistyped,
  inputIndex,
}) => {
  const renderKana = () => {
    return (
      <Text fontSize="4xl" fontWeight="bold" textAlign="center">
        {word}
      </Text>
    );
  };

  const renderRomaji = () => {
    const romajiChars = fullRomaji.split('');
    const userInputChars = userInput.split('');

    return (
      <Box textAlign="center">
        {romajiChars.map((char, index) => {
          let color = 'black';

          if (index < userInputChars.length) {
            color = 'green'; // 正しく入力された文字
          } else if (index === inputIndex && isMistyped) {
            color = 'red'; // ミスタイプした文字
          }

          return (
            <Text
              as="span"
              key={index}
              color={color}
              fontSize="xl"
              fontWeight="bold"
            >
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
