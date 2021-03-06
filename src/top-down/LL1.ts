import {Tree, DFSTree} from '@jlguenego/tree';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {ParseError} from '../ParseError';
import {PartialParseTree} from '../PartialParseTree';
import {testFn} from './common';

export const ll1GetChildren = (sentence: Sentence, cfg: ContextFreeGrammar) => (
  ppt: PartialParseTree
): PartialParseTree[] => {
  // only the first non terminal needs to be yielded. (left most derivation)
  const nts = ppt.sententialForm.findFirstNonTerminal();
  if (nts === undefined) {
    const length = ppt.sententialForm.symbols.length;
    if (length < sentence.length) {
      throw new ParseError('LL(1) Parser: Syntax Error.', sentence[length]);
    }
    return [];
  }

  // CS143 slide
  // the order of productions is now important. We take the one by looking at one lookahead token.
  const lookAheadToken = ppt.getLookAheadToken(sentence);
  const rhs = cfg.getfromLL1Table(nts, lookAheadToken);

  const result = [];
  const child = ppt.tree.clone();
  const ntl = child.find(t => t.node === nts) as Tree<ParseSymbol>;
  for (const s of rhs.symbols) {
    child.graft(ntl, new Tree<ParseSymbol>(s));
  }
  result.push(new PartialParseTree(child));

  return result;
};

export const parseWithLL1 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const dfsTree = new DFSTree<PartialParseTree>(
    new PartialParseTree(new Tree<ParseSymbol>(cfg.startSymbol)),
    testFn(sentence),
    ll1GetChildren(sentence, cfg)
  );
  const pt = dfsTree.search();
  if (pt === undefined) {
    throw new Error('did not worked. Syntax error in sentence?');
  }
  const parseTree = pt.tree.toObject() as ParseTree;
  return parseTree;
};
