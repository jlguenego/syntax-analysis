import {Tree, DFSTree} from '@jlguenego/tree';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {PartialParseTree} from '../PartialParseTree';
import {testFn} from './common';
import {checkLLkParsingTable} from './lib/LLK/buildLLkParsingTable';

export const parseWithLLk = (
  sentence: Sentence,
  cfg: ContextFreeGrammar,
  k: number
): ParseTree => {
  // TODO: use a kpredictive algo
  checkLLkParsingTable(cfg, k);
  const dfsTree = new DFSTree<PartialParseTree>(
    new PartialParseTree(new Tree<ParseSymbol>(cfg.startSymbol)),
    testFn(sentence),
    llkGetChildren(sentence, cfg, k)
  );
  const pt = dfsTree.search();
  if (pt === undefined) {
    throw new Error('did not worked. Syntax error in sentence?');
  }
  const parseTree = pt.tree.toObject() as ParseTree;
  return parseTree;
};
