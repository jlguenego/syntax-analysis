import {Tree, DFSTree} from '@jlguenego/tree';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {PartialParseTree} from '../PartialParseTree';
import {testFn} from './common';
import {checkLLkParsingTable} from './lib/LLkParsingTable';
import {NonTerminal} from '../NonTerminal';

export const llkGetChildren = (
  sentence: Sentence,
  cfg: ContextFreeGrammar,
  k: number
) => (ppt: PartialParseTree): PartialParseTree[] => {
  if (!ppt.sharePrefixWith(sentence)) {
    throw new Error('should not come here...');
  }

  // only the first non terminal needs to be yielded. (left most derivation)
  const firstNonTerminal = ppt.getFirstNonTerminal();
  if (!firstNonTerminal) {
    return [];
  }
  const nts = firstNonTerminal.subtree.node as NonTerminal;

  // CS143 slide
  // the order of productions is now important. We take the one by looking at one lookahead token.
  const lookAheadTokens = ppt.getLookAheadTokens(sentence, k);
  const index = cfg.getfromLLkTable(k, nts, lookAheadTokens);

  return [ppt.yield(firstNonTerminal.path, cfg.productions[index])];
};

export const parseWithLLk = (
  sentence: Sentence,
  cfg: ContextFreeGrammar,
  k: number
): ParseTree => {
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
