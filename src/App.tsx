import React, { useState } from "react";
import { Game } from "./Components/Game";
import { StartScreen } from "./Components/StartScreen";
import { UIProvider, VStack } from "@yamada-ui/react";
import { Result } from "./Components/Result";

const App: React.FC = () => {
  const [gameState, setGameState] = useState<"start" | "playing" | "result">(
    "start"
  );
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [gameResult, setGameResult] = useState<{
    score: number;
    mistypeCount: number;
    totalKeystrokes: number;
  } | null>(null);

  const handleStart = (selectedDifficulty: "easy" | "medium" | "hard") => {
    setDifficulty(selectedDifficulty);
    setGameState("playing");
  };

  const handleGameOver = (result: {
    score: number;
    mistypeCount: number;
    totalKeystrokes: number;
  }) => {
    setGameResult(result);
    setGameState("result");
  };

  const handleRestart = () => {
    setGameState("start");
    setGameResult(null);
  };

  const handleRetry = () => {
    setGameState("playing");
    setGameResult(null);
  };

  return (
    <UIProvider>
      <VStack align="center" justify="center" minH="100vh" w="100vw">
        {gameState === "start" && <StartScreen onStart={handleStart} />}
        {gameState === "playing" && (
          <Game
            difficulty={difficulty}
            onGameOver={handleGameOver}
            onExit={handleRestart}
          />
        )}
        {gameState === "result" &&
          gameResult && (
            <Result
              result={gameResult}
              onRestart={handleRestart}
              onRetry={handleRetry}
            />
          )}
      </VStack>
    </UIProvider>
  );
};

export default App;
