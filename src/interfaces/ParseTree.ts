import {Tree} from '@jlguenego/tree';
import {NonTerminal} from '../NonTerminal';
import {ParseSymbol} from './ParseSymbol';
import {Sentence} from './Sentence';
import {Terminal} from './Terminal';

export type ParseTree = ParseTreeBranch | ParseTreeLeaf;

export interface ParseTreeBranch {
  node: NonTerminal;
  children: ParseTree[];
}

export interface ParseTreeLeaf {
  node: Terminal;
}

export function getSentence(parseTree: ParseTree): Sentence {
  const tree: Tree<ParseSymbol> = Tree.fromObject<ParseSymbol>(parseTree);
  console.log('tree: ', tree);
  return tree.flatten() as Sentence;
}
