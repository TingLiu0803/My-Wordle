import { wordBank } from '../database/wordBank';

export const getRandomWord = () => {
  return wordBank[Math.floor(Math.random() * wordBank.length)];
};
