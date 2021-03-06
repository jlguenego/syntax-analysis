import {parseWithLALR1} from './bottom-up/LALR1';
import {parseWithLR0} from './bottom-up/LR0';
import {parseWithLR1} from './bottom-up/LR1';
import {parseWithSLR1} from './bottom-up/SLR1';
import {ContextFreeGrammar} from './ContextFreeGrammar';
import {ParseTree} from './interfaces/ParseTree';
import {Sentence} from './interfaces/Sentence';
import {parseWithBFS1} from './top-down/BFS1';
import {parseWithBFS2} from './top-down/BFS2';
import {parseWithBFS3} from './top-down/BFS3';
import {parseWithDFS1} from './top-down/DFS1';
import {parseWithDFS2} from './top-down/DFS2';
import {parseWithLL1} from './top-down/LL1';
import {parseWithLLk} from './top-down/LLk';

export interface ParseOptions {
  method:
    | 'BFS1'
    | 'BFS2'
    | 'BFS3'
    | 'DFS1'
    | 'DFS2'
    | 'LL1'
    | 'LLk'
    | 'LR0'
    | 'LR1'
    | 'SLR1'
    | 'LALR1';
  lookaheadTokenNbr: number;
}

export function parse(
  sentence: Sentence,
  cfg: ContextFreeGrammar,
  options: Partial<ParseOptions>
): ParseTree {
  const opts: ParseOptions = {
    method: 'BFS1',
    lookaheadTokenNbr: 2,
    ...options,
  };
  switch (opts.method) {
    case 'BFS1':
      return parseWithBFS1(sentence, cfg);
    case 'BFS2':
      return parseWithBFS2(sentence, cfg);
    case 'BFS3':
      return parseWithBFS3(sentence, cfg);
    case 'DFS1':
      return parseWithDFS1(sentence, cfg);
    case 'DFS2':
      return parseWithDFS2(sentence, cfg);
    case 'LL1':
      return parseWithLL1(sentence, cfg);
    case 'LLk':
      return parseWithLLk(sentence, cfg, opts.lookaheadTokenNbr);
    case 'LR0':
      return parseWithLR0(sentence, cfg);
    case 'LR1':
      return parseWithLR1(sentence, cfg);
    case 'SLR1':
      return parseWithSLR1(sentence, cfg);
    case 'LALR1':
      return parseWithLALR1(sentence, cfg);
    default:
      throw new Error('Method not implemented');
  }
}
