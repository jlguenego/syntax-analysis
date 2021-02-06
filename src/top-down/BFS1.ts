import {first} from 'rxjs/operators';
import {Tree, BFSTree, BFSTreeAsync} from '@jlguenego/tree';
import {Observable} from 'rxjs';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {NonTerminal} from '../NonTerminal';
import {PartialParseTree} from '../PartialParseTree';
import {testFn, testFnAsync} from './common';

export const bfs1GetChildren = (cfg: ContextFreeGrammar) => (
  ppt: PartialParseTree
): PartialParseTree[] => {
  // foreach leaves generate all possible production rules, and add the node to the tree.

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

export const parseWithBFS1 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const bfsTree = new BFSTree<PartialParseTree>(
    new PartialParseTree(new Tree<ParseSymbol>(cfg.startSymbol)),
    testFn(sentence),
    bfs1GetChildren(cfg)
  );
  const pt = bfsTree.search() as PartialParseTree;
  pt.tree.getLeaves().forEach((leaf, i) => (leaf.node = sentence[i]));
  const parseTree = pt.tree.toObject() as ParseTree;
  return parseTree;
};

export const getBFSTreeAsync = (
  sentence: Sentence,
  cfg: ContextFreeGrammar,
  observable: Observable<number>
): BFSTreeAsync<PartialParseTree> => {
  const bfsTree = new BFSTreeAsync<PartialParseTree>(
    new PartialParseTree(new Tree<ParseSymbol>(cfg.startSymbol)),
    testFnAsync(sentence),
    async (ppt: PartialParseTree) => {
      await observable.pipe(first()).toPromise();
      return bfs1GetChildren(cfg)(ppt);
    }
  );
  return bfsTree;
};
