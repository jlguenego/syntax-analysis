import {Automaton} from '../Automaton';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {LRState} from '../LRState';
import {ProductionWithPosition} from '../ProductionWithPosition';

export const buildAutomaton = (cfg: ContextFreeGrammar): Automaton<LRState> => {
  // add a first state with start symbol

  const startProductions = cfg.productions.filter(
    p => p.LHS === cfg.startSymbol
  );
  const pwps = new Set<ProductionWithPosition>();
  for (const prod of startProductions) {
    pwps.add(new ProductionWithPosition(prod, 0));
  }
  const startState = new LRState(cfg, pwps);
  const automaton = new Automaton<LRState>(startState);

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
        const newPwps = new Set<ProductionWithPosition>();
        const pwps = [...s1.pwps].filter(
          pwp => pwp.getNextSerializedSymbol() === symbol
        );
        pwps.forEach(p => {
          newPwps.add(new ProductionWithPosition(p.production, p.position + 1));
        });
        const newState = new LRState(cfg, newPwps);
        automaton.addTransition(s1, newState, symbol);
      });
    }

    previousSize = size;
    size = automaton.getSize();
  }
  return automaton;
};
