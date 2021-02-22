import {dollar} from './../terminals/dollar.terminal';
import {TerminalAlphabet} from '../TerminalAlphabet';
import {emptyWord, Word} from '@jlguenego/language';
import {Terminal} from './Terminal';

export type TWord = Word<TerminalAlphabet>;

export const newTWord = (symbols: Terminal[]) =>
  new Word<TerminalAlphabet>(symbols);

export const wordSetToString = (set: Set<TWord>) =>
  [...set].map(w => tWordToString(w)).toString();

export const tWordToString = (word: TWord) => {
  if (word === emptyWord) {
    return 'ε';
  }
  return word.symbols.map(t => t.name).join('');
};

export const dollarWord = newTWord([dollar]);
