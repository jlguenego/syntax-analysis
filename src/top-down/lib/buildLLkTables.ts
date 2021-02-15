import {LLkTableRow} from '../../LLkTableRow';
import {buildFirstk, firstkStar} from './firstk';
import {WordSet} from '../../WordSet';
import {epsilonWord} from '../../Word';
import {NonTerminal} from '../../NonTerminal';
import {ContextFreeGrammar, LLkTables} from '../../ContextFreeGrammar';
import {concatk} from './concatk';
import {buildFollowk} from './followk';
import {LLkTable} from '../../LLkTable';
// purpose is to build for a given grammar, a given k the LLktables.

const initLLkTableCache = (cfg: ContextFreeGrammar, k: number): void => {
  const map = new Map<NonTerminal, LLkTables>();
  cfg.llkTableCache.set(k, map);
};

const buildT0 = (cfg: ContextFreeGrammar, k: number) => {
  const s = cfg.startSymbol;
  const e = new WordSet(new Set([epsilonWord]));
  const t0 = buildLLkTable(cfg, k, s, e);
  const map: LLkTables = new Map();
  map.set(e, t0);
  cfg.llkTableCache.get(k)?.set(s, map);
};

const buildLLkTable = (
  cfg: ContextFreeGrammar,
  k: number,
  a: NonTerminal,
  l: WordSet
): LLkTable => {
  const result = new LLkTable();
  for (let i = 0; i < cfg.productions.length; i++) {
    if (cfg.productions[i].LHS !== a) {
      // we consider only the a production rules.
      continue;
    }
    const rhs = cfg.productions[i].RHS;
    const first = firstkStar(cfg, k, rhs);
    const set = concatk(k, first, l.set);
    for (const u of set) {
      const row = new LLkTableRow(i);
      row.addFollowSets(cfg, k, rhs, l);
      const existingTableRow = result.map.get(u);
      if (existingTableRow !== undefined) {
        throw new Error(
          `Grammar is not LL(${k}). Conflict while building the LLk Table. u=${u.toString()}, prod index rule=${i} and ${
            existingTableRow.prodIndex
          }`
        );
      }
      result.map.set(u, row);
    }
  }
  return result;
};

export const buildLLkTables = (cfg: ContextFreeGrammar, k: number) => {
  buildFirstk(cfg, k);
  buildFollowk(cfg, k);
  initLLkTableCache(cfg, k);
  buildT0(cfg, k);
};
