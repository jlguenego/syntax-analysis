import {ContextFreeGrammar} from './ContextFreeGrammar';
import {ParseTree} from './interfaces/ParseTree';
import {Sentence} from './interfaces/Sentence';
import {NonTerminalAlphabet} from './NonTerminalAlphabet';
import {TerminalAlphabet} from './TerminalAlphabet';
import {parseWithBFS1} from './top-down/BFS1';
import {parseWithBFS2} from './top-down/BFS2';

export interface ParseOptions {
  method: 'BFS1' | 'BFS2';
}

export function parse<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
>(
  sentence: Sentence,
  cfg: ContextFreeGrammar<T, NT>,
  options: Partial<ParseOptions>
): ParseTree {
  const opts: ParseOptions = {
    method: 'BFS1',
    ...options,
  };
  if (opts.method === 'BFS1') {
    return parseWithBFS1(sentence, cfg);
  }
  if (opts.method === 'BFS2') {
    return parseWithBFS2(sentence, cfg);
  }
  throw new Error('Method not implemented');
}
