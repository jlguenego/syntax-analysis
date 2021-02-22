import {Word} from '@jlguenego/language';

import {dollar} from '../terminals/dollar.terminal';
import {LLkParsingTable} from '../LLkParsingTable';
import {SententialForm} from '../SententialForm';
import {ParsingResultRule} from './ParsingResultRule';
import {buildLLkTables, getLLkTableCache} from './buildLLkTables';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {NonTerminal} from '../NonTerminal';
import {buildFirstk} from './firstk';
import {buildFollowk} from './followk';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {Sentence} from '../interfaces/Sentence';
import {ParsingTableFn} from '../interfaces/ParsingTableFn';
import {LLkTable} from '../LLkTable';
import {ParsingResultEnum} from '../interfaces/ParsingResultEnum';
import {TWord} from '../interfaces/TWord';

export const checkLLkParsingTable = (
  cfg: ContextFreeGrammar,
  k: number
): void => {
  if (cfg.llkParsingTableCache.get(k)) {
    return;
  }
  buildLLkParsingTable(cfg, k);
};

const initLLkParsingTableCache = (cfg: ContextFreeGrammar, k: number): void => {
  const map = new LLkParsingTable();
  cfg.llkParsingTableCache.set(k, map);
};

const getLLkParsingTableCache = (
  cfg: ContextFreeGrammar,
  k: number
): LLkParsingTable => {
  return cfg.llkParsingTableCache.get(k) as LLkParsingTable;
};

export const buildLLkParsingTableCache = (
  cfg: ContextFreeGrammar,
  k: number
) => {
  initLLkParsingTableCache(cfg, k);
  for (const ti of getLLkTableCache(cfg, k).getTables()) {
    for (const [word, tablerow] of ti.map) {
      const rhs = cfg.productions[tablerow.prodIndex].RHS;
      const symbols = [...rhs.symbols];
      let followSetIndex = 0;
      for (let i = 0; i < symbols.length; i++) {
        const s = symbols[i];
        if (s instanceof NonTerminal) {
          symbols[i] = getLLkTableCache(cfg, k).get(
            s,
            tablerow.followSet[followSetIndex].wordset
          ) as NonTerminal;
          followSetIndex++;
        }
      }
      const beta = new SententialForm(symbols);
      getLLkParsingTableCache(cfg, k).set(
        ti,
        word,
        new ParsingResultRule(tablerow.prodIndex, beta)
      );
    }
  }
};

export const buildLLkParsingTable = (
  cfg: ContextFreeGrammar,
  k: number
): ParsingTableFn => {
  buildFirstk(cfg, k);
  buildFollowk(cfg, k);
  buildLLkTables(cfg, k);
  buildLLkParsingTableCache(cfg, k);
  return (symbol: ParseSymbol, lookaheadString: Sentence) => {
    if (symbol instanceof NonTerminal) {
      const word = (Word.retrieveFromCache(
        lookaheadString
      ) as unknown) as TWord;
      if (word) {
        const result = getLLkParsingTableCache(cfg, k).get(
          symbol as LLkTable,
          word
        );
        if (result) {
          return result;
        }
      }
      return ParsingResultEnum.ERROR;
    }
    const first = lookaheadString[0];
    if (lookaheadString.length === 0) {
      if (symbol === dollar) {
        return ParsingResultEnum.ACCEPT;
      }
    }
    if (first.name === symbol.name) {
      return ParsingResultEnum.POP;
    }

    // other cases
    return ParsingResultEnum.ERROR;
  };
};
