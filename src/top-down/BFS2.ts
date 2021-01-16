import {Tree, BFSTree} from '@jlguenego/tree';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {NonTerminal} from '../NonTerminal';
import {PartialParseTree} from '../PartialParseTree';
import {testFn} from './common';

export const parseWithBFS2 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const getChildren = (ppt: PartialParseTree): PartialParseTree[] => {
    // JLG optimization. This is true exept if there is a production with RHS empty.
    if (
      !cfg.hasEmptyProduction() &&
      ppt.sententialForm.symbols.length > sentence.length
    ) {
      return [];
    }

    // CS143 slide 49
    // https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/lectures/03/Slides03.pdf
    if (!ppt.sharePrefixWith(sentence)) {
      return [];
    }

    const ntsArray = ppt.sententialForm.symbols.filter(
      s => s instanceof NonTerminal
    );
    const result = [];
    for (const nts of ntsArray) {
      const productions = cfg.productions.filter(p => p.LHS === nts);
      for (const prod of productions) {
        const child = ppt.tree.clone();
        const ntl = child.find(t => t.node === nts) as Tree<ParseSymbol>;
        for (const s of prod.RHS.symbols) {
          child.graft(ntl, new Tree<ParseSymbol>(s));
        }
        result.push(new PartialParseTree(child));
      }
    }
    return result;
  };
  const bfsTree = new BFSTree<PartialParseTree>(
    new PartialParseTree(new Tree<ParseSymbol>(cfg.startSymbol)),
    testFn(sentence),
    getChildren
  );
  const pt = bfsTree.search() as PartialParseTree;
  const parseTree = pt.tree.toObject() as ParseTree;
  return parseTree;
};
