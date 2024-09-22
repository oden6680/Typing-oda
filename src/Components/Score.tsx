import React from 'react';
import { Text, VStack } from '@yamada-ui/react';

interface ScoreProps {
  score: number;
  mistypeCount: number;
  totalKeystrokes: number;
}

export const Score: React.FC<ScoreProps> = ({
  score,
  mistypeCount,
  totalKeystrokes,
}) => {
  const accuracy =
    totalKeystrokes > 0
      ? (((totalKeystrokes - mistypeCount) / totalKeystrokes) * 100).toFixed(2)
      : '100';

  return (
    <VStack width="100%" textAlign="center">
      <Text fontSize="lg">スコア: {score} 点</Text>
      <Text fontSize="lg">ミスタイプ数: {mistypeCount} 回</Text>
      <Text fontSize="lg">正答率: {accuracy} %</Text>
    </VStack>
  );
};
