import {Tree, DFSTree} from '@jlguenego/tree';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {NonTerminal} from '../NonTerminal';
import {PartialParseTree} from '../PartialParseTree';
import {testFn} from './common';

export const dfs2GetChildren = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
) => (ppt: PartialParseTree): PartialParseTree[] => {
  // check
  if (
    !cfg.hasEmptyProduction() &&
    ppt.sententialForm.symbols.length > sentence.length
  ) {
    return [];
  }

  // only the first non terminal needs to be yielded. (left most derivation)
  const fnt = ppt.getFirstNonTerminal();
  if (!fnt) {
    return [];
  }
  const nts = fnt.subtree.node;

  // CS143 slide
  // the order of productions is now important. We take the one by looking at one lookahead token.
  const lookAheadToken = ppt.getLookAheadToken(sentence);
  const terminals = cfg.first(nts);
  if (!terminals.map(t => t.name).includes(lookAheadToken.name)) {
    return [];
  }

  const result = [];
  const productions = cfg.productions
    .filter(p => p.LHS === nts)
    .filter(
      p =>
        p.RHS.symbols[0] instanceof NonTerminal ||
        p.RHS.symbols[0].name === lookAheadToken.name
    );
  for (const prod of productions) {
    result.push(ppt.yield(fnt.path, prod));
  }

  return result;
};

export const parseWithDFS2 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const dfsTree = new DFSTree<PartialParseTree>(
    new PartialParseTree(new Tree<ParseSymbol>(cfg.startSymbol)),
    testFn(sentence),
    dfs2GetChildren(sentence, cfg)
  );
  const pt = dfsTree.search();
  if (pt === undefined) {
    throw new Error('did not worked. Syntax error in sentence?');
  }
  const parseTree = pt.tree.toObject() as ParseTree;
  return parseTree;
};
