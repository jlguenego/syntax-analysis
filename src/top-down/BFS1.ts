// import {ContextFreeGrammar} from '../ContextFreeGrammar';
// import {Sentence} from '../interfaces/Sentence';
// import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
// import {TerminalAlphabet} from '../TerminalAlphabet';
// import {BFSTree, breadthFirstSearch} from './lib/breadthFirstSearch';

// export const parseWithBFS1 = <
//   T extends TerminalAlphabet,
//   NT extends NonTerminalAlphabet
// >(
//   sentence: Sentence<T>,
//   cfg: ContextFreeGrammar<T, NT>
// ) => {
//   console.log('sentence: ', sentence);
//   const startParseTree: ParseTree<T, NT> = {
//     node: cfg.startSymbol,
//     children: [],
//   };
//   const rootTree: BFSTree<ParseTree<T, NT>> = {
//     value: startParseTree,
//     test: isParseTreeValid(sentence),
//     getChildren: () => [],
//     parent: undefined,
//     root: undefined,
//   };
//   const tree = breadthFirstSearch(rootTree);
//   console.log('tree: ', tree);
//   return result;
// };
