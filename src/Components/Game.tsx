import React, { useState, useEffect } from "react";
import { WordDisplay } from "./WordDisplay";
import { Timer } from "./Timer";
import { Score } from "./Score";
import { VStack } from "@yamada-ui/react";
import { toRomaji } from "wanakana";
import { wordsEasy, WordData as EasyWordData } from "../data/wordsEasy";
import { wordsMedium } from "../data/wordsMedium";
import { wordsHard } from "../data/wordsHard";

interface GameProps {
  difficulty: "easy" | "medium" | "hard";
  onGameOver: (result: {
    score: number;
    mistypeCount: number;
    totalKeystrokes: number;
  }) => void;
  onExit: () => void;
}

type WordData = EasyWordData;

export const Game: React.FC<GameProps> = ({
  difficulty,
  onGameOver,
  onExit,
}) => {
  const [currentWord, setCurrentWord] = useState<WordData>({
    kanji: "",
    kana: "",
  });
  const [romajiList, setRomajiList] = useState<string[]>([]);
  const [displayRomajiList, setDisplayRomajiList] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [currentKanaInput, setCurrentKanaInput] = useState("");
  const [kanaIndex, setKanaIndex] = useState(0);
  const [isMistyped, setIsMistyped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [mistypeCount, setMistypeCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const wordsEasyList: WordData[] = wordsEasy;
  const wordsMediumList: WordData[] = wordsMedium;
  const wordsHardList: WordData[] = wordsHard;

  useEffect(() => {
    initializeWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const initializeWord = () => {
    let wordList: WordData[];
    if (difficulty === "easy") {
      wordList = wordsEasyList;
    } else if (difficulty === "medium") {
      wordList = wordsMediumList;
    } else {
      wordList = wordsHardList;
    }
    const newWord = wordList[Math.floor(Math.random() * wordList.length)];
    setCurrentWord(newWord);
    setUserInput("");
    setCurrentKanaInput("");
    setKanaIndex(0);
    setIsMistyped(false);
    const romajiString = toRomaji(newWord.kana, {
      useObsoleteKana: false,
      passRomaji: false,
    });
    const romajiArray = romajiString.split("");
    setRomajiList(romajiArray);
    setDisplayRomajiList(romajiArray.map((char) => char));
  };

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft <= 0 && !isGameOver) {
      setIsGameOver(true);
      onGameOver({
        score,
        mistypeCount,
        totalKeystrokes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key.length === 1 && /^[a-z¥-]$/.test(key)) {
        e.preventDefault();
        setTotalKeystrokes((prev) => prev + 1);

        const expectedRomaji = romajiList[kanaIndex];
        const newCurrentKanaInput = currentKanaInput + key;

        if (newCurrentKanaInput === expectedRomaji) {
          setUserInput((prev) => prev + newCurrentKanaInput);
          setCurrentKanaInput("");
          setKanaIndex(kanaIndex + 1);
          setIsMistyped(false);

          if (kanaIndex + 1 === romajiList.length) {
            setScore((prev) => prev + 1);
            initializeWord();
          } else {
            setDisplayRomajiList((prev) => {
              const newDisplayRomajiList = [...prev];
              newDisplayRomajiList[kanaIndex + 1] = romajiList[kanaIndex + 1];
              return newDisplayRomajiList;
            });
          }
        } else if (expectedRomaji.startsWith(newCurrentKanaInput)) {
          setCurrentKanaInput(newCurrentKanaInput);
          setIsMistyped(false);
        } else {
          setMistypeCount((prev) => prev + 1);
          setIsMistyped(true);
        }
      } else if (e.code === "Escape") {
        e.preventDefault();
        onExit();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        if (currentKanaInput.length > 0) {
          setCurrentKanaInput((prev) => prev.slice(0, -1));
          setIsMistyped(false);
        } else if (kanaIndex > 0) {
          setKanaIndex((prev) => prev - 1);
          const previousRomaji = romajiList[kanaIndex - 1];
          setUserInput((prev) => prev.slice(0, -previousRomaji.length));
          setDisplayRomajiList((prev) => {
            const newDisplayRomajiList = [...prev];
            newDisplayRomajiList[kanaIndex - 1] = romajiList[kanaIndex - 1];
            return newDisplayRomajiList;
          });
          setIsMistyped(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentKanaInput,
    isGameOver,
    kanaIndex,
    romajiList,
    userInput,
    isMistyped,
    onExit,
  ]);

  return (
    <VStack align="stretch" justify="center" minH="100vh" w="100vw">
      <Timer timeLeft={timeLeft} />
      <Score
        score={score}
        mistypeCount={mistypeCount}
        totalKeystrokes={totalKeystrokes}
      />
      <WordDisplay
        word={currentWord.kanji}
        displayRomajiList={displayRomajiList}
        isMistyped={isMistyped}
        currentKanaInput={currentKanaInput}
        userInput={userInput}
      />
    </VStack>
  );
};
