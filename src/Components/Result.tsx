import React from "react";
import { Button, Text, VStack } from "@yamada-ui/react";

interface ResultProps {
  result: {
    score: number;
    mistypeCount: number;
    totalKeystrokes: number;
  } | null;
  onRestart: () => void;
  onRetry: () => void;
}

export const Result: React.FC<ResultProps> = ({
  result,
  onRestart,
  onRetry,
}) => {
  if (!result) {
    return null;
  }

  const { score, mistypeCount, totalKeystrokes } = result;
  const accuracy =
    totalKeystrokes > 0
      ? (((totalKeystrokes - mistypeCount) / totalKeystrokes) * 100).toFixed(2)
      : "100";

  return (
    <VStack align="center" width="100%">
      <Text fontSize="3xl" fontWeight="bold">
        ゲーム終了
      </Text>
      <Text fontSize="lg">スコア: {score}</Text>
      <Text fontSize="lg">ミスタイプ数: {mistypeCount}</Text>
      <Text fontSize="lg">正答率: {accuracy}%</Text>
      <Button onClick={onRetry}>もう一度プレイ</Button>
      <Button onClick={onRestart}>難易度を選び直す</Button>
    </VStack>
  );
};
