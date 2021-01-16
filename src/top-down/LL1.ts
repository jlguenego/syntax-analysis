import {Tree, DFSTree} from '@jlguenego/tree';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {NonTerminal} from '../NonTerminal';
import {PartialParseTree} from '../PartialParseTree';
import {testFn} from './common';

export const parseWithLL1 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const getChildren = (ppt: PartialParseTree): PartialParseTree[] => {
    // only the first non terminal needs to be yielded. (left most derivation)
    const nts = ppt.sententialForm.symbols.find(s => s instanceof NonTerminal);
    if (nts === undefined) {
      return [];
    }

    // CS143 slide
    // the order of productions is now important. We take the one by looking at one lookahead token.
    const lookAheadToken = ppt.getLookAheadToken(sentence);
    const terminals = cfg.first(nts);
    if (!terminals.map(t => t.name).includes(lookAheadToken.name)) {
      return [];
    }
    const result = [];
    const productions = cfg.productions.filter(p => p.LHS === nts);
    for (const prod of productions) {
      const child = ppt.tree.clone();
      const ntl = child.find(t => t.node === nts) as Tree<ParseSymbol>;
      for (const s of prod.RHS.symbols) {
        child.graft(ntl, new Tree<ParseSymbol>(s));
      }
      result.push(new PartialParseTree(child));
    }

    return result;
  };
  const dfsTree = new DFSTree<PartialParseTree>(
    new PartialParseTree(new Tree<ParseSymbol>(cfg.startSymbol)),
    testFn(sentence),
    getChildren
  );
  const pt = dfsTree.search();
  if (pt === undefined) {
    throw new Error('did not worked. Syntax error in sentence?');
  }
  const parseTree = pt.tree.toObject() as ParseTree;
  return parseTree;
};
