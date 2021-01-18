import {Automaton} from '../Automaton';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {BUState} from '../interfaces/BUState';
import {LRState} from '../LRState';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {ProductionWithPosition} from '../ProductionWithPosition';

export const buildAutomaton = (
  cfg: ContextFreeGrammar
): Automaton<LRState, ParseSymbol> => {
  const automaton = new Automaton<LRState, ParseSymbol>();
  // add a first state with start symbol

  const startProductions = cfg.productions.filter(
    p => p.LHS === cfg.startSymbol
  );
  const pwps = new Set<ProductionWithPosition>();
  for (const prod of startProductions) {
    pwps.add(new ProductionWithPosition(prod, 0));
  }
  const startState = new LRState(cfg, pwps);
  automaton.addState(startState);

  let previousSize = 0;
  let size = automaton.getSize();
  while (previousSize < size) {
    previousSize = size;
    size = automaton.getSize();
  }
  return automaton;
};

// const shift = (previousState: BUState) => {
//   const state = {...previousState};
//   state.remainingSentence = state.remainingSentence.slice(1);
//   state.parseTrees = [...state.parseTrees];
//   state.parseTrees.push({node: previousState.remainingSentence[0]});
//   return state;
// };

// const reduce = (previousState: BUState, production: Production) => {
//   const state = {...previousState};
//   const length = production.RHS.symbols.length;
//   const reducedParseTree = state.parseTrees.slice(0, length);
//   const replacedSlice = state.parseTrees.slice(-length);
//   reducedParseTree.push({node: production.LHS, children: replacedSlice});
//   state.parseTrees = reducedParseTree;
//   return state;
// };

export const parseWithLR1 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const remainingSentence = [...sentence];
  const parseTrees: ParseTree[] = [];
  const state: BUState = {
    remainingSentence,
    parseTrees,
    cfg,
  };
  while (remainingSentence.length > 0) {
    // find if you need to shift or reduce.
  }

  return state.parseTrees[0];
};
