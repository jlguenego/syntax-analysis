import {KPredictiveParser} from './lib/LLK/KPredictiveParser';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';

export const parseWithLLk = (
  sentence: Sentence,
  cfg: ContextFreeGrammar,
  k: number
): ParseTree => {
  // TODO: use a kpredictive algo
  const algo = new KPredictiveParser(cfg, k, sentence);
  const parseTree = algo.run();
  return parseTree;
};
