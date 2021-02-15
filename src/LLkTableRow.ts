import {LocalFollow} from './interfaces/LocalFollow';
import {firstkStar} from './top-down/lib/LLK/firstk';
import {ContextFreeGrammar} from './ContextFreeGrammar';
import {NonTerminal} from './NonTerminal';
import {SententialForm} from './SententialForm';
import {WordSet} from './WordSet';
import {concatk} from './top-down/lib/LLK/concatk';
export class LLkTableRow {
  followSet: LocalFollow[] = [];
  constructor(public prodIndex: number) {}

  addFollowSets(
    cfg: ContextFreeGrammar,
    k: number,
    rhs: SententialForm,
    l: WordSet
  ) {
    const indexList = rhs.getAllNonTerminalIndexList();
    for (const i of indexList) {
      const nt = rhs.symbols[i] as NonTerminal;
      const wordset = new WordSet(
        concatk(k, firstkStar(cfg, k, rhs.slice(i + 1)), l.set)
      );
      this.followSet.push({nt, wordset});
    }
  }

  toString() {
    let result = '' + this.prodIndex + ' | ';
    if (this.followSet.length === 0) {
      result += '<empty>';
    }
    for (const follow of this.followSet) {
      const followStr = follow.nt + ':' + follow.wordset;
      result += followStr;
    }
    return result;
  }
}
