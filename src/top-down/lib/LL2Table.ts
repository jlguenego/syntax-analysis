import {ContextFreeGrammar} from '../../ContextFreeGrammar';

export const checkLL2Table = (cfg: ContextFreeGrammar): void => {
  if (cfg.llkTableCache) {
    return;
  }
  buildLL2Table(cfg);
};

const initLL2TableCache = (cfg: ContextFreeGrammar): void => {
  for (const nt of cfg.productionMap.keys()) {
    cfg.llkTableCache.set(nt, undefined);
  }
};

export const buildLL2Table = (cfg: ContextFreeGrammar): void => {
  initLL2TableCache(cfg);
};
