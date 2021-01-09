import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';

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
  return result;
};
