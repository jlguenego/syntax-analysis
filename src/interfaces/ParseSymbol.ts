import {NonTerminal} from '../NonTerminal';
import {Terminal} from './Terminal';

export type ParseSymbol = Terminal | NonTerminal;

export const psSerialize = (s: ParseSymbol): string => {
  return s instanceof NonTerminal ? 'NT_' + s.label : 'T_' + s.name;
};
