import {Tree, BFSTree} from '@jlguenego/tree';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {NonTerminal} from '../NonTerminal';
import {PartialParseTree} from '../PartialParseTree';
import {testFn} from './common';

const getChildren = (sentence: Sentence, cfg: ContextFreeGrammar) => (
  ppt: PartialParseTree
): PartialParseTree[] => {
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

  const paths = ppt.tree
    .getLeaves()
    .filter(t => t.node instanceof NonTerminal)
    .map(t => ppt.tree.getPath(t) as number[]);

  const result = [];
  for (const path of paths) {
    const nts = ppt.tree.getSubTree(path).node;
    const productions = cfg.productions.filter(p => p.LHS === nts);
    for (const prod of productions) {
      const child = ppt.tree.clone();
      const ntl = child.getSubTree(path);
      for (const s of prod.RHS.symbols) {
        child.graft(ntl, new Tree<ParseSymbol>(s));
      }
      result.push(new PartialParseTree(child));
    }
  }
  return result;
};

export const parseWithBFS2 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const bfsTree = new BFSTree<PartialParseTree>(
    new PartialParseTree(new Tree<ParseSymbol>(cfg.startSymbol)),
    testFn(sentence),
    getChildren(sentence, cfg)
  );
  const pt = bfsTree.search() as PartialParseTree;
  const parseTree = pt.tree.toObject() as ParseTree;
  return parseTree;
};
