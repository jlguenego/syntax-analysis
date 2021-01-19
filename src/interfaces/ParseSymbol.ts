import {NonTerminal} from '../NonTerminal';
import {Terminal} from './Terminal';

export type ParseSymbol = Terminal | NonTerminal;

export const psSerialize = (s: ParseSymbol): string => {
  return s instanceof NonTerminal ? s.serialize() : 'T_' + s.name;
};
