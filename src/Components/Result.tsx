import React from 'react';
import { Button, Text, VStack } from '@yamada-ui/react';

interface ResultProps {
  score: number;
  mistypeCount: number;
  totalKeystrokes: number;
}

export const Result: React.FC<ResultProps> = ({
  score,
  mistypeCount,
  totalKeystrokes,
}) => {
  const accuracy =
    totalKeystrokes > 0
      ? (((totalKeystrokes - mistypeCount) / totalKeystrokes) * 100).toFixed(2)
      : '100';

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <VStack align="center" width="100%">
      <Text fontSize="3xl" fontWeight="bold">
        ゲームおわり！
      </Text>
      <Text fontSize="lg">スコア: {score} 点</Text>
      <Text fontSize="lg">ミスタイプ数: {mistypeCount} 回</Text>
      <Text fontSize="lg">正答率: {accuracy}%</Text>
      <Button onClick={handleRestart} mt={4}>
        Restart
      </Button>
    </VStack>
  );
};
