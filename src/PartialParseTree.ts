import {Tree} from '@jlguenego/tree';
import {ParseSymbol} from './interfaces/ParseSymbol';
import {Sentence} from './interfaces/Sentence';
import {NonTerminal} from './NonTerminal';

export class PartialParseTree {
  private leaves!: Tree<ParseSymbol>[];
  constructor(public tree: Tree<ParseSymbol>) {}

  getLeaves() {
    this.leaves = this.leaves ?? this.tree.getLeaves();
    return this.leaves;
  }

  sharePrefixWith(sentence: Sentence): boolean {
    this.getLeaves();
    for (let i = 0; i < Math.min(sentence.length, this.leaves.length); i++) {
      const s = this.leaves[i].node;
      if (s instanceof NonTerminal) {
        return true;
      }
      if (s.name !== sentence[i].name) {
        return false;
      }
    }
    return true;
  }
}
