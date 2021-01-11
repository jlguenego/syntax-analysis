import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence, sentenceEquals} from '../interfaces/Sentence';
import {Tree} from '../lib/Tree';
import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';
import {BFSTree} from './lib/breadthFirstSearch';

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
    const sententialForm = t.flatten();
    return sentenceEquals(sentence, sententialForm as Sentence);
  };
  const getChildren = (t: PartialParseTree) => {
    console.log('t: ', t);
    // foreach leaves generate all possible production rules, and add the node to the tree.
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
