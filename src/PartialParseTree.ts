import {Tree} from '@jlguenego/tree';
import {epsilon} from './terminals/epsilon.terminal';
import {ParseSymbol} from './interfaces/ParseSymbol';
import {Sentence} from './interfaces/Sentence';
import {SententialForm} from './SententialForm';
import {NonTerminal} from './NonTerminal';
import {Terminal} from './interfaces/Terminal';

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

  getLookAheadToken(sentence: Sentence): Terminal {
    const index = this.sententialForm.symbols.findIndex(
      s => s instanceof NonTerminal
    );
    if (index === -1) {
      throw new Error('getLookAheadToken should not be called on sentence');
    }
    return sentence[index];
  }
}
