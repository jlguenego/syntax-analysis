import {NonTerminal} from '../NonTerminal';
import {Terminal} from './Terminal';

export type ParseTree = ParseTreeBranch | ParseTreeLeaf;

export interface ParseTreeBranch {
  v: NonTerminal;
  c: ParseTree[];
}

export interface ParseTreeLeaf {
  v: Terminal;
}
