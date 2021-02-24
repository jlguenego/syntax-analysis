import {Word} from '@jlguenego/language';

import {Terminal} from './Terminal';
import {dollar} from '../terminals/dollar.terminal';
import {TerminalAlphabet} from '../TerminalAlphabet';

export type TWord = Word<TerminalAlphabet>;

export const newTWord = (symbols: Terminal[]) =>
  new Word<TerminalAlphabet>(symbols);

export const wordSetToString = (set: Set<TWord>) =>
  [...set].map(w => w.toString()).toString();

export const dollarWord = newTWord([dollar]);
