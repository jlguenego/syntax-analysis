import {LLkTable} from '../LLkTable';
import {LLkTableRow} from '../LLkTableRow';
import {buildFirstk, firstkStar} from './firstk';
import {WordSet} from '../WordSet';
import {NonTerminal} from '../NonTerminal';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {concatk} from './concatk';
import {buildFollowk} from './followk';
import {LLkTables} from '../LLkTables';
import {emptyWord} from '@jlguenego/language';

const initLLkTableCache = (cfg: ContextFreeGrammar, k: number): void => {
  cfg.llkTableCache.set(k, new LLkTables());
};

export const getLLkTableCache = (
  cfg: ContextFreeGrammar,
  k: number
): LLkTables => {
  return cfg.llkTableCache.get(k) as LLkTables;
};

const buildT0 = (cfg: ContextFreeGrammar, k: number) => {
  const s = cfg.startSymbol;
  const e = new WordSet(new Set([emptyWord]));
  const t0 = buildLLkTable(cfg, k, 0, s, e);
  getLLkTableCache(cfg, k).add(s, e, t0);
};

export const getT0 = (cfg: ContextFreeGrammar, k: number): LLkTable => {
  return getLLkTableCache(cfg, k).getTables()[0];
};

const buildLLkTable = (
  cfg: ContextFreeGrammar,
  k: number,
  index: number,
  a: NonTerminal,
  l: WordSet
): LLkTable => {
  const result = new LLkTable(index, a, l);
  for (let i = 0; i < cfg.productions.length; i++) {
    if (cfg.productions[i].LHS !== a) {
      // we consider only the a production rules.
      continue;
    }
    const rhs = cfg.productions[i].RHS;
    const first = firstkStar(cfg, k, rhs);
    const set = concatk(k, first, l.getSet());
    for (const u of set) {
      const row = new LLkTableRow(i);
      row.addFollowSets(cfg, k, rhs, l);
      const existingTableRow = result.map.get(u);
      if (existingTableRow !== undefined) {
        throw new Error(
          `Grammar is not LL(${k}). Conflict while building the LLk Table. u=${u.toString()}, prod index rule=${i} and ${
            existingTableRow.prodIndex
          }.`
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
  const tables = getLLkTableCache(cfg, k);
  let previousSize = 0;
  let size = 1;
  while (previousSize < size) {
    for (const table of tables.getTables()) {
      const followSet = table.getFollowSet();
      for (const localFollow of followSet) {
        const ti = buildLLkTable(
          cfg,
          k,
          tables.getSize(),
          localFollow.nt,
          localFollow.wordset
        );
        getLLkTableCache(cfg, k).add(localFollow.nt, localFollow.wordset, ti);
      }
    }
    previousSize = size;
    size = tables.getSize();
  }
};
