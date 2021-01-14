import {Tree, BFSTree} from '@jlguenego/tree';
import {inspect} from 'util';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence, sentenceEquals} from '../interfaces/Sentence';
import {NonTerminal} from '../NonTerminal';
import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';

export type PartialParseTree = Tree<ParseSymbol>;

let seq = 1;

export const parseWithBFS1 = <
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
>(
  sentence: Sentence,
  cfg: ContextFreeGrammar<T, NT>
): ParseTree => {
  const test = (t: PartialParseTree): boolean => {
    seq++;
    if (seq > 1000) {
      throw new Error('too much. stop');
    }
    const sententialForm = t.flatten();
    if (sentenceEquals(sentence, sententialForm)) {
      console.log('seq: ', seq);
      return true;
    }
    return false;
  };
  const getChildren = (t: PartialParseTree) => {
    // foreach leaves generate all possible production rules, and add the node to the tree.
    const leaves = t.getLeaves();

    // JLG optimization
    if (leaves.length > sentence.length) {
      return [];
    }
    const ntLeaves = leaves.filter(leaf => leaf.node instanceof NonTerminal);
    const result = [];
    for (const ntleaf of ntLeaves) {
      const productions = cfg.productions.filter(p => p.LHS === ntleaf.node);
      for (const prod of productions) {
        const child = t.clone();
        const ntl = child.find(t => t.node === ntleaf.node) as PartialParseTree;
        for (const s of prod.RHS) {
          child.graft(ntl, new Tree<ParseSymbol>(s));
        }
        result.push(child);
      }
    }
    return result;
  };
  const bfsTree = new BFSTree<PartialParseTree>(
    new Tree<ParseSymbol>(cfg.startSymbol),
    test,
    getChildren
  );
  const pt = bfsTree.search() as PartialParseTree;
  const parseTree = pt.toObject() as ParseTree;
  return parseTree;
};
