import {Tree, BFSTree} from '@jlguenego/tree';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence, sentenceEquals} from '../interfaces/Sentence';
import {NonTerminal} from '../NonTerminal';
import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {PartialParseTree} from '../PartialParseTree';
import {TerminalAlphabet} from '../TerminalAlphabet';

let seq = 1;

export const parseWithBFS2 = <
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
    const sententialForm = t.tree.flatten();
    if (sentenceEquals(sentence, sententialForm)) {
      console.log('seq: ', seq);
      return true;
    }
    return false;
  };
  const getChildren = (ppt: PartialParseTree): PartialParseTree[] => {
    // foreach leaves generate all possible production rules, and add the node to the tree.
    const leaves = ppt.tree.getLeaves();

    // JLG optimization. This is true exept if there is a production with RHS empty.
    if (!cfg.hasEmptyProduction() && leaves.length > sentence.length) {
      return [];
    }

    // CS143 slide 49
    // https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/lectures/03/Slides03.pdf
    if (!ppt.sharePrefixWith(sentence)) {
      return [];
    }

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
    test,
    getChildren
  );
  const pt = bfsTree.search() as PartialParseTree;
  const parseTree = pt.tree.toObject() as ParseTree;
  return parseTree;
};
