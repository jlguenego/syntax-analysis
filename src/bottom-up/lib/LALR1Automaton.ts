import {Automaton} from '../../Automaton';
import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {LR1Item} from './LR1Item';
import {dollar} from '../../terminals/dollar.terminal';
import {checkStartSymbol} from './check';
import {LALR1State} from './LALR1State';

export const buildLALR1Automaton = (
  cfg: ContextFreeGrammar
): Automaton<LALR1State> => {
  const cache: LALR1State[] = [];
  checkStartSymbol(cfg);

  // add a first state with start symbol

  const startProductions = cfg.productions.filter(
    p => p.LHS === cfg.startSymbol
  );
  const configSet = new Set<LR1Item>();
  for (const prod of startProductions) {
    configSet.add(new LR1Item(prod, 0, dollar));
  }
  const startState = new LALR1State(cfg, configSet, cache);
  const automaton = new Automaton<LALR1State>(startState);

  let previousSize = 0;
  let size = automaton.getSize();
  while (previousSize < size) {
    const array = automaton.getStateArray();
    if (array.length > 10000) {
      throw new Error('too much states. LR1-Grammar too complicated ?');
    }
    for (const s1 of array) {
      const symbols = s1.getSymbolTransitions();
      symbols.forEach(symbol => {
        if (automaton.getTransition(s1, symbol)) {
          return;
        }
        const newConfigSet = new Set<LR1Item>();
        const items = [...s1.configSet].filter(
          item => item.getNextSerializedSymbol() === symbol
        );
        items.forEach(p => {
          newConfigSet.add(
            new LR1Item(p.production, p.position + 1, p.lookAhead)
          );
        });
        const newState = new LALR1State(cfg, newConfigSet, cache);
        automaton.addTransition(s1, newState, symbol);
      });
    }

    previousSize = size;
    size = automaton.getSize();
  }
  return automaton;
};
