import React, { useState, useEffect } from 'react';
import { WordDisplay } from './WordDisplay';
import { Timer } from './Timer';
import { Score } from './Score';
import { Result } from './Result';
import { VStack } from '@yamada-ui/react';
import { kanaToRomajiMap, isSmallKana } from '../Utils/romajiMap';

const words = ['こんにちは', 'さようなら', 'ありがとう', 'おはよう', 'こんばんは'];

export const Game: React.FC = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [fullRomaji, setFullRomaji] = useState('');
  const [userInput, setUserInput] = useState('');
  const [inputIndex, setInputIndex] = useState(0);
  const [isMistyped, setIsMistyped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [mistypeCount, setMistypeCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    initializeWord();
  }, []);

  const initializeWord = () => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(newWord);
    setUserInput('');
    setInputIndex(0);
    setIsMistyped(false);
    const romajiArray = convertKanaToRomaji(newWord);
    setFullRomaji(romajiArray.join(''));
  };

  const convertKanaToRomaji = (word: string): string[] => {
    const romajiArray: string[] = [];
    let i = 0;
    while (i < word.length) {
      let kana = word[i];
      if (i + 1 < word.length && isSmallKana(word[i + 1])) {
        kana += word[i + 1];
        i += 2;
      } else {
        i += 1;
      }
      const possibleRomaji = kanaToRomajiMap[kana];
      if (possibleRomaji && possibleRomaji.length > 0) {
        romajiArray.push(possibleRomaji[0]);
      } else {
        romajiArray.push('');
      }
    }
    return romajiArray;
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      setIsGameOver(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key.length === 1 && /^[a-z]$/.test(key)) {
        e.preventDefault();
        setTotalKeystrokes((prev) => prev + 1);

        const expectedChar = fullRomaji[inputIndex];

        if (isMistyped) {
          if (key === expectedChar) {
            setIsMistyped(false);
            setUserInput((prev) => prev + key);
            setInputIndex((prev) => prev + 1);

            if (inputIndex + 1 === fullRomaji.length) {
              setScore((prev) => prev + 1);
              initializeWord();
            }
          } else {
            setMistypeCount((prev) => prev + 1);
          }
        } else {
          if (key === expectedChar) {
            setUserInput((prev) => prev + key);
            setInputIndex((prev) => prev + 1);

            if (inputIndex + 1 === fullRomaji.length) {
              setScore((prev) => prev + 1);
              initializeWord();
            }
          } else {
            setIsMistyped(true);
            setMistypeCount((prev) => prev + 1);
          }
        }
      } else if (key === 'Backspace') {
        e.preventDefault();
        if (isMistyped) {
          setIsMistyped(false);
        } else if (userInput.length > 0) {
          setUserInput((prev) => prev.slice(0, -1));
          setInputIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputIndex, fullRomaji, userInput, totalKeystrokes, isMistyped, isGameOver]);

  return (
    <VStack
      align="stretch"
      justify="center"
      minH="100vh"
      w="100vw"
    >
      {!isGameOver ? (
        <>
          <Timer timeLeft={timeLeft} />
          <Score
            score={score}
            mistypeCount={mistypeCount}
            totalKeystrokes={totalKeystrokes}
          />
          <WordDisplay
            word={currentWord}
            fullRomaji={fullRomaji}
            userInput={userInput}
            isMistyped={isMistyped}
            inputIndex={inputIndex}
          />
        </>
      ) : (
        <Result
          score={score}
          mistypeCount={mistypeCount}
          totalKeystrokes={totalKeystrokes}
        />
      )}
    </VStack>
  );
};
