import {Tree, BFSTree, BFSTreeAsync} from '@jlguenego/tree';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {NonTerminal} from '../NonTerminal';
import {PartialParseTree} from '../PartialParseTree';
import {testFn, testFnAsync} from './common';

export const bfs3GetChildren = (
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

  // We take ONLY the first nonterminal for expansion. The leftmost derivation.

  const paths = ppt.tree
    .getLeaves()
    .filter(t => t.node instanceof NonTerminal)
    .slice(0, 1)
    .map(t => ppt.tree.getPath(t) as number[]);

  if (paths.length === 0) {
    return [];
  }

  const path = paths[0];

  const result = [];

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

  return result;
};

export const parseWithBFS3 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const bfsTree = new BFSTree<PartialParseTree>(
    new PartialParseTree(new Tree<ParseSymbol>(cfg.startSymbol)),
    testFn(sentence),
    bfs3GetChildren(sentence, cfg)
  );
  const pt = bfsTree.search();
  if (pt === undefined) {
    throw new Error('did not worked. Syntax error in sentence?');
  }
  const parseTree = pt.tree.toObject() as ParseTree;
  return parseTree;
};

export const getBFS3TreeAsync = (
  sentence: Sentence,
  cfg: ContextFreeGrammar,
  observable: Observable<number>
): BFSTreeAsync<PartialParseTree> => {
  const bfsTree = new BFSTreeAsync<PartialParseTree>(
    new PartialParseTree(new Tree<ParseSymbol>(cfg.startSymbol)),
    testFnAsync(sentence),
    async (ppt: PartialParseTree) => {
      await observable.pipe(first()).toPromise();
      return bfs3GetChildren(sentence, cfg)(ppt);
    }
  );
  return bfsTree;
};
