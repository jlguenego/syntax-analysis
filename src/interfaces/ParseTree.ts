import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';

export type ParseTree<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
> = ParseTreeLeaf<T> | ParseTreeBranch<T, NT>;

export interface ParseTreeLeaf<T extends TerminalAlphabet> {
  node: T[keyof T];
}

export interface ParseTreeBranch<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
> {
  node: NT[keyof NT];
  children: ParseTree<T, NT>[];
}
