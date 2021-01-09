import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {SententialForm} from '../interfaces/SententialForm';
import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';
import {BFSTree, breadthFirstSearch} from './lib/breadthFirstSearch';

export const parseWithBFS1 = <
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
>(
  sentence: Sentence<T>,
  cfg: ContextFreeGrammar<T, NT>
) => {
  console.log('sentence: ', sentence);
  const result: ParseTree<T, NT> = {
    node: cfg.startSymbol,
    children: [],
  };
  const rootTree: BFSTree<SententialForm<T, NT>> = {
    value: [cfg.startSymbol],
    equals: (a: SententialForm<T, NT>, b: SententialForm<T, NT>) => {
      console.log('a and b', a, b);
      return true;
    },
    getChildren: () => [],
    parent: undefined,
    root: undefined,
  };
  const tree = breadthFirstSearch(rootTree);
  console.log('tree: ', tree);
  return result;
};
