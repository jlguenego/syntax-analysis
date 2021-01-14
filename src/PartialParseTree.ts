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
    for (let i = 0; i < sentence.length; i++) {
      const s = this.getLeaves()[i].node;
      if (s instanceof NonTerminal) {
        return true;
      }
      if (s !== sentence[i]) {
        return false;
      }
    }
    return true;
  }
}
