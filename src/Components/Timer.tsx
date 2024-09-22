import React from 'react';
import { Text } from '@yamada-ui/react';

interface TimerProps {
  timeLeft: number;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  return (
    <Text fontSize="lg" textAlign="center" width="100%">
      残り時間: {timeLeft} 秒
    </Text>
  );
};
