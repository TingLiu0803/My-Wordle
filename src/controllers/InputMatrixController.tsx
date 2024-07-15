import React, { ChangeEvent, useState, useRef, useEffect } from 'react';
import { InputBox } from '../views/InputBox';
import { wordBank } from '../database/wordBank';
import { getRandomWord } from '../utilities/getWord';
import { buttonStyle } from '../styleConstants';

export const InputMatrixController: React.FC = () => {
  const [currentWord, _] = useState(getRandomWord());
  const [guesses, setGuesses] = useState(
    Array.from({ length: 6 }, () => Array(5).fill(''))
  );
  const [colors, setColors] = useState(
    Array.from({ length: 6 }, () => Array(5).fill('bg-zinc-900'))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [isGameEnd, setIsGameEnd] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array.from({ length: 6 }, () => Array(5).fill(null))
  );

  useEffect(() => {
    const inputElement = inputRefs.current[currentRow][currentCol];
    if (inputElement) {
      inputElement.focus();
    }
  }, [currentCol, currentRow]);

  const changeLetterOnlyToUpperCase = (
    event: ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    if (rowIndex !== currentRow) return;
    const value = event.target.value.toUpperCase().replace(/[^A-Z]/gi, '');
    const newGuesses = [...guesses];
    newGuesses[rowIndex][colIndex] = value;
    setGuesses(newGuesses);
    if (value && colIndex < 4) {
      setCurrentCol(colIndex + 1);
    }
  };

  const handleSubmit = () => {
    // Only submit if the row is filled
    if (guesses[currentRow].some(g => g === '')) {
      alert('Please fill in all the letters.');
      return;
    }
    const currentGuess = guesses[currentRow].join('');
    if (wordBank.includes(currentGuess)) {
      const newColors = [...colors];
      currentGuess.split('').forEach((letter, index) => {
        if (letter === currentWord[index]) {
          newColors[currentRow][index] = 'bg-green-500'; // Correct letter and position
        } else if (currentWord.includes(letter)) {
          newColors[currentRow][index] = 'bg-yellow-500'; // Correct letter, wrong position
        } else {
          newColors[currentRow][index] = 'bg-gray-500'; // Incorrect letter
        }
      });
      setColors(newColors);
      if (currentRow < 5) {
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      }
      // Check if the word is correct, and end the game if it is
      // When game is ended, disable all input boxes
      if (currentGuess === currentWord) {
        setIsGameEnd(true);
        alert('Congratulations! You have guessed the word correctly.');
      }
    } else {
      alert('Invalid word. Please try a different word.');
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    if (rowIndex !== currentRow) return;
    if (event.key === 'Backspace' || event.key === 'Delete') {
      if (guesses[rowIndex][colIndex] === '' && colIndex > 0) {
        // Move the focus to the previous box if the current box is empty
        setCurrentCol(colIndex - 1);
      } else {
        // Clear the current box
        const newGuesses = [...guesses];
        newGuesses[rowIndex][colIndex] = '';
        setGuesses(newGuesses);
        if (colIndex > 0 && guesses[rowIndex][colIndex] === '') {
          setCurrentCol(colIndex - 1);
        }
      }
      event.preventDefault(); // Prevent the default action to stop from deleting the content twice
    }
  };

  const inputMatrix = guesses.map((guess, rowIndex) => (
    <div key={rowIndex}>
      {guess.map((g, colIndex) => (
        <InputBox
          key={colIndex}
          ref={el => (inputRefs.current[rowIndex][colIndex] = el)}
          value={g}
          onChange={e => changeLetterOnlyToUpperCase(e, rowIndex, colIndex)}
          onKeyDown={e => handleKeyDown(e, rowIndex, colIndex)}
          disabled={rowIndex !== currentRow || isGameEnd}
          style={colors[rowIndex][colIndex]}
        />
      ))}
    </div>
  ));

  return (
    <form onSubmit={e => e.preventDefault()}>
      {inputMatrix}
      {currentRow < 6 && (
        <button
          onClick={handleSubmit}
          className={buttonStyle}
          disabled={isGameEnd}
        >
          {isGameEnd ? 'You Win!' : 'Submit'}
        </button>
      )}
    </form>
  );
};
