import {Tree, DFSTree} from '@jlguenego/tree';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {PartialParseTree} from '../PartialParseTree';
import {testFn} from './common';
import {checkLLkTable} from './lib/LLkTable';
import {NonTerminal} from '../NonTerminal';

export const llkGetChildren = (sentence: Sentence, cfg: ContextFreeGrammar) => (
  ppt: PartialParseTree
): PartialParseTree[] => {
  // only the first non terminal needs to be yielded. (left most derivation)
  const fnt = ppt.getFirstNonTerminal();
  if (!fnt) {
    return [];
  }
  const nts = fnt.subtree.node as NonTerminal;

  // CS143 slide
  // the order of productions is now important. We take the one by looking at one lookahead token.
  const lookAheadTokens = ppt.getLookAheadTokens(
    sentence,
    cfg.lookaheadTokenNbr
  );
  const index = cfg.getfromLLkTable(nts, lookAheadTokens);

  return [ppt.yield(fnt.path, cfg.productions[index])];
};

export const parseWithLLk = (
  sentence: Sentence,
  cfg: ContextFreeGrammar,
  lookaheadTokenNbr: number
): ParseTree => {
  checkLLkTable(cfg, lookaheadTokenNbr);
  const dfsTree = new DFSTree<PartialParseTree>(
    new PartialParseTree(new Tree<ParseSymbol>(cfg.startSymbol)),
    testFn(sentence),
    llkGetChildren(sentence, cfg)
  );
  const pt = dfsTree.search();
  if (pt === undefined) {
    throw new Error('did not worked. Syntax error in sentence?');
  }
  const parseTree = pt.tree.toObject() as ParseTree;
  return parseTree;
};
