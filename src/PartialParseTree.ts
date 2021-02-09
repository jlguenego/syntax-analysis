import {Production} from './interfaces/Production';
import {Tree} from '@jlguenego/tree';
import {epsilon} from './terminals/epsilon.terminal';
import {ParseSymbol} from './interfaces/ParseSymbol';
import {Sentence} from './interfaces/Sentence';
import {SententialForm} from './SententialForm';
import {NonTerminal} from './NonTerminal';
import {Terminal} from './interfaces/Terminal';
import {dollar} from './terminals/dollar.terminal';

export interface SubtreePath {
  subtree: Tree<ParseSymbol>;
  path: number[];
}

export class PartialParseTree {
  sententialForm = new SententialForm(
    this.tree
      .getLeaves()
      .map(t => t.node)
      .filter(node =>
        node instanceof NonTerminal ? true : node.name !== epsilon.name
      )
  );
  constructor(public tree: Tree<ParseSymbol>) {}

  sharePrefixWith(sentence: Sentence): boolean {
    for (
      let i = 0;
      i < Math.min(sentence.length, this.sententialForm.symbols.length);
      i++
    ) {
      const s = this.sententialForm.symbols[i];
      if (s instanceof NonTerminal) {
        return true;
      }
      if (s.name !== sentence[i].name) {
        return false;
      }
    }
    return true;
  }

  getFirstNonTerminal(): SubtreePath | undefined {
    const subtree = this.tree
      .getLeaves()
      .find(t => t.node instanceof NonTerminal);
    if (!subtree) {
      return undefined;
    }
    const path = this.tree.getPath(subtree) as number[];
    return {subtree, path};
  }

  yield(nt: SubtreePath, prod: Production): PartialParseTree {
    const child = this.tree.clone();
    const ntl = child.getSubTree(nt.path);
    for (const s of prod.RHS.symbols) {
      child.graft(ntl, new Tree<ParseSymbol>(s));
    }
    return new PartialParseTree(child);
  }

  getLookAheadToken(sentence: Sentence): Terminal {
    const index = this.sententialForm.symbols.findIndex(
      s => s instanceof NonTerminal
    );
    if (index === -1) {
      throw new Error('getLookAheadToken should not be called on sentence');
    }
    if (index >= sentence.length) {
      return dollar;
    }
    return sentence[index];
  }
}
