import {Tree} from '@jlguenego/tree';
import {ParseSymbol} from './interfaces/ParseSymbol';
import {Sentence} from './interfaces/Sentence';
import {SententialForm} from './interfaces/SententialForm';
import {Terminal} from './interfaces/Terminal';
import {NonTerminal} from './NonTerminal';

export class PartialParseTree {
  sententialForm: SententialForm = this.tree.getLeaves().map(t => t.node);
  constructor(public tree: Tree<ParseSymbol>) {}

  sharePrefixWith(sentence: Sentence): boolean {
    for (
      let i = 0;
      i < Math.min(sentence.length, this.sententialForm.length);
      i++
    ) {
      const s = this.sententialForm[i];
      if (s instanceof NonTerminal) {
        return true;
      }
      if (s.name !== sentence[i].name) {
        return false;
      }
    }
    return true;
  }

  getLookAheadToken(sentence: Sentence): Terminal {
    return sentence[0];
  }
}
