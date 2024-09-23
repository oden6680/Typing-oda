import React, { useState, useEffect } from 'react';
import { WordDisplay } from './WordDisplay';
import { Timer } from './Timer';
import { Score } from './Score';
import { VStack } from '@yamada-ui/react';
import { kanaToRomajiMap, isSmallKana } from '../Utils/romajiMap';

interface GameProps {
  difficulty: 'easy' | 'medium' | 'hard';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onGameOver: (result: any) => void;
  onExit: () => void; // 追加
}

interface WordData {
  kanji: string;
  kana: string;
}

export const Game: React.FC<GameProps> = ({ difficulty, onGameOver, onExit }) => {
  const [currentWord, setCurrentWord] = useState<WordData>({ kanji: '', kana: '' });
  const [romajiList, setRomajiList] = useState<string[][]>([]);
  const [displayRomajiList, setDisplayRomajiList] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [currentKanaInput, setCurrentKanaInput] = useState('');
  const [kanaIndex, setKanaIndex] = useState(0);
  const [isMistyped, setIsMistyped] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [mistypeCount, setMistypeCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const wordsEasy: WordData[] = [
    { kanji: 'こんにちは', kana: 'こんにちは' },
    { kanji: 'さようなら', kana: 'さようなら' },
    { kanji: 'ありがとう', kana: 'ありがとう' },
    { kanji: 'おはよう', kana: 'おはよう' },
    { kanji: 'こんばんは', kana: 'こんばんは' },
  ];

  const wordsMedium: WordData[] = [
    { kanji: '学生', kana: 'がくせい' },
    { kanji: '先生', kana: 'せんせい' },
    { kanji: '学校', kana: 'がっこう' },
    { kanji: '図書館', kana: 'としょかん' },
    { kanji: '病院', kana: 'びょういん' },
  ];

  const wordsHard: WordData[] = [
    { kanji: '経済', kana: 'けいざい' },
    { kanji: '政治', kana: 'せいじ' },
    { kanji: '文化', kana: 'ぶんか' },
    { kanji: '歴史', kana: 'れきし' },
    { kanji: '哲学', kana: 'てつがく' },
  ];

  useEffect(() => {
    initializeWord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const initializeWord = () => {
    let wordList: WordData[];
    if (difficulty === 'easy') {
      wordList = wordsEasy;
    } else if (difficulty === 'medium') {
      wordList = wordsMedium;
    } else {
      wordList = wordsHard;
    }
    const newWord = wordList[Math.floor(Math.random() * wordList.length)];
    setCurrentWord(newWord);
    setUserInput('');
    setCurrentKanaInput('');
    setKanaIndex(0);
    setIsMistyped(false);
    const romajiArray = convertKanaToRomaji(newWord.kana);
    setRomajiList(romajiArray);
    const initialDisplayRomaji = romajiArray.map(options => options[0]);
    setDisplayRomajiList(initialDisplayRomaji);
  };

  const convertKanaToRomaji = (word: string): string[][] => {
    const romajiArray: string[][] = [];
    let i = 0;
    let geminateConsonant = false;

    while (i < word.length) {
      const kana = word[i];

      if (kana === 'っ') {
        geminateConsonant = true;
        i += 1;
        continue;
      }

      let currentRomajiOptions: string[] = [];

      if (i + 1 < word.length && isSmallKana(word[i + 1]) && word[i + 1] !== 'っ') {
        const combinedKana = kana + word[i + 1];
        currentRomajiOptions = kanaToRomajiMap[combinedKana] || [''];
        i += 2;
      } else {
        currentRomajiOptions = kanaToRomajiMap[kana] || [''];
        i += 1;
      }

      if (geminateConsonant && currentRomajiOptions.length > 0 && currentRomajiOptions[0].length > 0) {
        const firstConsonant = currentRomajiOptions[0][0];
        const modifiedOptions = currentRomajiOptions.map(romaji => {
          if (/^[bcdfghjklmnpqrstvwxyz]/.test(romaji)) {
            return firstConsonant + romaji;
          }
          return romaji;
        });
        romajiArray.push(modifiedOptions);
        geminateConsonant = false;
      } else {
        romajiArray.push(currentRomajiOptions);
      }
    }

    return romajiArray;
  };

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      const timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
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

      if (key.length === 1 && /^[a-z]$/.test(key)) {
        e.preventDefault();
        setTotalKeystrokes(prev => prev + 1);

        const currentRomajiOptions = romajiList[kanaIndex];
        const expectedRomajiList = currentRomajiOptions;

        const newCurrentKanaInput = currentKanaInput + key;

        let matched = false;

        for (const expectedRomaji of expectedRomajiList) {
          if (expectedRomaji.startsWith(newCurrentKanaInput)) {
            matched = true;
            if (expectedRomaji === newCurrentKanaInput) {
              setUserInput(prev => prev + newCurrentKanaInput);
              setCurrentKanaInput('');
              setKanaIndex(kanaIndex + 1);
              setIsMistyped(false);

              if (kanaIndex + 1 === romajiList.length) {
                setScore(prev => prev + 1);
                initializeWord();
              } else {
                setDisplayRomajiList(prev => {
                  const newDisplayRomajiList = [...prev];
                  newDisplayRomajiList[kanaIndex + 1] = romajiList[kanaIndex + 1][0];
                  return newDisplayRomajiList;
                });
              }
            } else {
              setCurrentKanaInput(newCurrentKanaInput);
              setIsMistyped(false); 
            }
            break;
          }
        }

        if (!matched) {
          setMistypeCount(prev => prev + 1);
          setIsMistyped(true);
        }
      } else if (key === 'escape') {
        e.preventDefault();
        onExit();
      } else if (key === 'backspace') {
        e.preventDefault();
        if (currentKanaInput.length > 0) {
          setCurrentKanaInput(prev => prev.slice(0, -1));
          setIsMistyped(false);
        } else if (kanaIndex > 0) {
          setKanaIndex(prev => prev - 1);
          const previousRomaji = romajiList[kanaIndex - 1][0];
          setUserInput(prev => prev.slice(0, -previousRomaji.length));
          setDisplayRomajiList(prev => {
            const newDisplayRomajiList = [...prev];
            newDisplayRomajiList[kanaIndex - 1] = romajiList[kanaIndex - 1][0];
            return newDisplayRomajiList;
          });
          setIsMistyped(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    <VStack
      align="stretch"
      justify="center"
      minH="100vh"
      w="100vw"
    >
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
