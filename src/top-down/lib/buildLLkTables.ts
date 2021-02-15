import {LLkTableRow} from '../../LLkTableRow';
import {buildFirstk, firstkStar} from './firstk';
import {WordSet} from '../../WordSet';
import {epsilonWord} from '../../Word';
import {NonTerminal} from '../../NonTerminal';
import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {concatk} from './concatk';
import {buildFollowk} from './followk';
import {LLkTable} from '../../LLkTable';
import {LLkTables} from '../../LLkTables';

const initLLkTableCache = (cfg: ContextFreeGrammar, k: number): void => {
  cfg.llkTableCache.set(k, new LLkTables());
};

const getLLkTableCache = (cfg: ContextFreeGrammar, k: number): LLkTables => {
  return cfg.llkTableCache.get(k) as LLkTables;
};

const buildT0 = (cfg: ContextFreeGrammar, k: number) => {
  const s = cfg.startSymbol;
  const e = new WordSet(new Set([epsilonWord]));
  const t0 = buildLLkTable(cfg, k, s, e);
  getLLkTableCache(cfg, k).add(s, e, t0);
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