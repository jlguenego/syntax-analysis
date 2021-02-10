import {NonTerminal} from './../../NonTerminal';
import {ParseSymbol} from './../../interfaces/ParseSymbol';
import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {Word} from '../../Word';
// See algorithm in book Aho Ullman Chapter 5.1, page 357 and 358.

const f0 = (cfg: ContextFreeGrammar, k: number, nt: NonTerminal): Set<Word> => {
  const array = cfg
    .getProdRHSArray(nt)
    .map(s => {
      const x = s.getNonTerminalPrefix().slice(0, k);
      if (x.length < k) {
        if (s.getLength() > x.length) {
          return [];
        }
      }
      return x;
    })
    .filter(a => a.length > 0)
    .map(a => new Word(a));
  return new Set(array);
};

export const fi = (
  cfg: ContextFreeGrammar,
  k: number,
  s: ParseSymbol,
  i: number
): Set<Word> => {
  if (!(s instanceof NonTerminal)) {
    return new Set([new Word([s])]);
  }
  if (i === 0) {
    return f0(cfg, k, s);
  }
  throw new Error('not implemented');
};
