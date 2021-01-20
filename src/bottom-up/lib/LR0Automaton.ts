import {Automaton} from '../../Automaton';
import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {LR0State} from './LR0State';
import {LR0Item} from './LR0Item';

export const buildLR0Automaton = (
  cfg: ContextFreeGrammar
): Automaton<LR0State> => {
  // add a first state with start symbol

  const startProductions = cfg.productions.filter(
    p => p.LHS === cfg.startSymbol
  );
  const items = new Set<LR0Item>();
  for (const prod of startProductions) {
    items.add(new LR0Item(prod, 0));
  }
  const startState = new LR0State(cfg, items);
  const automaton = new Automaton<LR0State>(startState);

  let previousSize = 0;
  let size = automaton.getSize();
  while (previousSize < size) {
    const array = automaton.getStateArray();
    if (array.length > 10000) {
      throw new Error('too much states. LR-Grammar too complicated ?');
    }
    for (const s1 of array) {
      const symbols = s1.getSymbolTransitions();
      symbols.forEach(symbol => {
        if (automaton.getTransition(s1, symbol)) {
          return;
        }
        const newItems = new Set<LR0Item>();
        const items = [...s1.items].filter(
          item => item.getNextSerializedSymbol() === symbol
        );
        items.forEach(p => {
          newItems.add(new LR0Item(p.production, p.position + 1));
        });
        const newState = new LR0State(cfg, newItems);
        automaton.addTransition(s1, newState, symbol);
      });
    }

    previousSize = size;
    size = automaton.getSize();
  }
  return automaton;
};