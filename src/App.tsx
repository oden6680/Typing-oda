/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Game } from './Components/Game';
import { StartScreen } from './Components/StartScreen';
import { UIProvider, VStack } from '@yamada-ui/react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'game'>('start');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameResult, setGameResult] = useState<any>(null);

  const handleStart = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    setGameState('game');
  };

  const handleGameOver = (result: any) => {
    setGameResult(result);
    setGameState('start');
  };

  const handleExitGame = () => {
    setGameState('start');
  };

  return (
    <UIProvider>
      <VStack align="center" justify="center" minH="100vh" w="100vw">
        {gameState === 'start' ? (
          <StartScreen onStart={handleStart} gameResult={gameResult} />
        ) : (
          <Game difficulty={difficulty} onGameOver={handleGameOver} onExit={handleExitGame} />
        )}
      </VStack>
    </UIProvider>
  );
};

export default App;
