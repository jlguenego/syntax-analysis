import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {Terminal} from '../interfaces/Terminal';
import {Tree} from '../lib/Tree';
import {NonTerminal} from '../NonTerminal';
import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';
import {BFSTree} from './lib/breadthFirstSearch';

export type ParseSymbol = Terminal | NonTerminal;
export type PartialParseTree = Tree<ParseSymbol>;

export const parseWithBFS1 = <
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
>(
  sentence: Sentence,
  cfg: ContextFreeGrammar<T, NT>
): ParseTree => {
  const test = (t: PartialParseTree): boolean => {
    console.log('t: ', t);
    return true;
  };
  const getChildren = (t: PartialParseTree) => {
    console.log('t: ', t);
    return [];
  };
  const bfsTree = new BFSTree<PartialParseTree>(
    new Tree<ParseSymbol>(cfg.startSymbol),
    test,
    getChildren
  );
  const p = bfsTree.search();
  const parseTree = (p as unknown) as ParseTree;
  return parseTree;
};
