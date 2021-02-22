import {Terminal} from './interfaces/Terminal';
import {alphabet, JSSymbol} from '@jlguenego/language';

export interface TerminalAlphabet {
  [key: string]: Terminal;
}

export const defineTerminalAlphabet = <T extends string>(a: readonly T[]) =>
  alphabet(JSSymbol, ...a);
