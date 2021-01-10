import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';

export type SententialForm<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
> = (T[keyof T] | NT[keyof NT])[];

// // flat parse tree
// export function isParseTreeValid<
//   T extends TerminalAlphabet,
//   NT extends NonTerminalAlphabet
// >(sentence: SententialForm<T, NT>) {
//   console.log('sentence: ', sentence);
//   return (parseTree: ParseTree<T, NT>) => {
//     return parseTree.getSententialForm().equals(sentence);
//   };
// }
