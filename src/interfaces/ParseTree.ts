import {Tree} from '../lib/Tree';
import {NonTerminal} from '../NonTerminal';
import {Sentence} from './Sentence';
import {Terminal} from './Terminal';

export type ParseTree = ParseTreeBranch | ParseTreeLeaf;

export interface ParseTreeBranch {
  v: NonTerminal;
  c: ParseTree[];
}

export interface ParseTreeLeaf {
  v: Terminal;
}

export function getSentence(parseTree: ParseTree): Sentence {
  const tree: Tree<Terminal | NonTerminal> = Tree.fromObject<
    Terminal | NonTerminal
  >(parseTree);
  console.log('tree: ', tree);
  return tree.flatten() as Sentence;
}
