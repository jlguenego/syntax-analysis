import {alphabet, JSSymbol} from '@jlguenego/language';

export class TerminalAlphabet {}

export const defineTerminalAlphabet = <T extends string>(a: readonly T[]) =>
  alphabet(JSSymbol, ...a) as Record<T, JSSymbol> & TerminalAlphabet;
