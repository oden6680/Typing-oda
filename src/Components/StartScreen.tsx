import React, { useState, useEffect } from 'react';
import { VStack, Button, Heading, Text } from '@yamada-ui/react';

interface StartScreenProps {
  onStart: (difficulty: 'easy' | 'medium' | 'hard') => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gameResult: any;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, gameResult }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (selectedDifficulty) {
          onStart(selectedDifficulty);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDifficulty, onStart]);

  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
  };

  return (
    <VStack align="center">
      <Heading>織打</Heading>
      {gameResult && (
        <VStack>
          <Text>スコア: {gameResult.score}</Text>
          <Text>ミスタイプ数: {gameResult.mistypeCount}</Text>
          <Text>総打鍵数: {gameResult.totalKeystrokes}</Text>
        </VStack>
      )}
      <VStack>
        <Button 
          onClick={() => handleDifficultySelect('easy')} 
          variant={selectedDifficulty === 'easy' ? 'solid' : 'outline'} 
          colorScheme="green"
        >
          小田(簡単)
        </Button>
        <Button 
          onClick={() => handleDifficultySelect('medium')} 
          variant={selectedDifficulty === 'medium' ? 'solid' : 'outline'} 
          colorScheme="blue"
        >
          尾田(普通)
        </Button>
        <Button 
          onClick={() => handleDifficultySelect('hard')} 
          variant={selectedDifficulty === 'hard' ? 'solid' : 'outline'} 
          colorScheme="red"
        >
          織田(難しい)
        </Button>
      </VStack>
    <Text>難易度を選択し、スペースキーを押してゲームを開始してください</Text>
    </VStack>
  );
};