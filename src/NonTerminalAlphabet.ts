import {alphabet} from '@jlguenego/language';
import {NonTerminal} from './NonTerminal';

export interface NonTerminalAlphabet {
  [key: string]: NonTerminal;
}

export const defineNonTerminalAlphabet = <T extends string>(a: readonly T[]) =>
  alphabet(NonTerminal, ...a);
