import {ContextFreeGrammar} from './ContextFreeGrammar';
import {ParseTree} from './interfaces/ParseTree';
import {Sentence} from './interfaces/Sentence';
import {NonTerminalAlphabet} from './NonTerminalAlphabet';
import {TerminalAlphabet} from './TerminalAlphabet';
import {parseWithBFS1} from './top-down/BFS1';
import {parseWithBFS2} from './top-down/BFS2';
import {parseWithBFS3} from './top-down/BFS3';

export interface ParseOptions {
  method: 'BFS1' | 'BFS2' | 'BFS3';
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
  switch (opts.method) {
    case 'BFS1':
      return parseWithBFS1(sentence, cfg);
    case 'BFS2':
      return parseWithBFS2(sentence, cfg);
    case 'BFS3':
      return parseWithBFS3(sentence, cfg);
    default:
      throw new Error('Method not implemented');
  }
}
