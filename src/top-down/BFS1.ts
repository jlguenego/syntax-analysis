import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';

export const parseWithBFS1 = <
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
>(
  sentence: Sentence,
  cfg: ContextFreeGrammar<T, NT>
): ParseTree => {
  const result: ParseTree = {
    v: cfg.startSymbol,
    c: [],
  };
  return result;
};
