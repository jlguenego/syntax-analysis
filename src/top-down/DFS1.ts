import {Tree, DFSTree, DFSTreeAsync} from '@jlguenego/tree';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {NonTerminal} from '../NonTerminal';
import {PartialParseTree} from '../PartialParseTree';
import {testFn, testFnAsync} from './common';

export const dfs1GetChildren = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
) => (ppt: PartialParseTree): PartialParseTree[] => {
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

  // CS143 slide 51 : consider only left most derivation.
  const nts = ppt.sententialForm.symbols.find(s => s instanceof NonTerminal);
  if (nts === undefined) {
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

export const parseWithDFS1 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const dfsTree = new DFSTree<PartialParseTree>(
    new PartialParseTree(new Tree<ParseSymbol>(cfg.startSymbol)),
    testFn(sentence),
    dfs1GetChildren(sentence, cfg)
  );
  const pt = dfsTree.search();
  if (pt === undefined) {
    throw new Error('did not worked. Syntax error in sentence?');
  }
  const parseTree = pt.tree.toObject() as ParseTree;
  return parseTree;
};

export const getDFS1TreeAsync = (
  sentence: Sentence,
  cfg: ContextFreeGrammar,
  observable: Observable<number>
): DFSTreeAsync<PartialParseTree> => {
  const bfsTree = new DFSTreeAsync<PartialParseTree>(
    new PartialParseTree(new Tree<ParseSymbol>(cfg.startSymbol)),
    testFnAsync(sentence),
    async (ppt: PartialParseTree) => {
      await observable.pipe(first()).toPromise();
      return dfs1GetChildren(sentence, cfg)(ppt);
    }
  );
  return bfsTree;
};
