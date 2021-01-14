import {Tree, BFSTree} from '@jlguenego/tree';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {NonTerminal} from '../NonTerminal';
import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {PartialParseTree} from '../PartialParseTree';
import {TerminalAlphabet} from '../TerminalAlphabet';
import {testFn} from './common';

export const parseWithBFS1 = <
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
>(
  sentence: Sentence,
  cfg: ContextFreeGrammar<T, NT>
): ParseTree => {
  const getChildren = (ppt: PartialParseTree): PartialParseTree[] => {
    // foreach leaves generate all possible production rules, and add the node to the tree.
    const leaves = ppt.getLeaves();

    const ntLeaves = leaves.filter(leaf => leaf.node instanceof NonTerminal);
    const result = [];
    for (const ntleaf of ntLeaves) {
      const productions = cfg.productions.filter(p => p.LHS === ntleaf.node);
      for (const prod of productions) {
        const child = ppt.tree.clone();
        const ntl = child.find(
          t => t.node === ntleaf.node
        ) as Tree<ParseSymbol>;
        for (const s of prod.RHS) {
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
