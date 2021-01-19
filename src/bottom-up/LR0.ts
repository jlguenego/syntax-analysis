import {Automaton} from '../Automaton';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {BUState, getForm} from '../interfaces/BUState';
import {LRState} from '../LRState';
import {ParseTree} from '../interfaces/ParseTree';
import {Sentence} from '../interfaces/Sentence';
import {ProductionWithPosition} from '../ProductionWithPosition';
import {psSerialize} from '../interfaces/ParseSymbol';
import {Production} from '../interfaces/Production';
import {cfg} from '../../test/data/cfg1';

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

const canShift = (state: BUState): boolean => {
  if (!state.automaton.hasCurrentTransitions()) {
    return false;
  }

  if (state.remainingSentence.length === 0) {
    return false;
  }
  const symbol = state.remainingSentence[0];

  // terminal case
  const transition = state.automaton.getCurrentTransition(psSerialize(symbol));
  if (!transition) {
    return false;
  }
  return true;
};

const shift = (previousState: BUState): BUState => {
  const t = previousState.remainingSentence[0];
  const state = {...previousState};
  state.remainingSentence = state.remainingSentence.slice(1);
  state.parseTrees = [...state.parseTrees];
  state.parseTrees.push({node: t});
  state.automaton.jump(psSerialize(t));
  return state;
};

const reduce = (previousState: BUState, production: Production) => {
  const state = {...previousState};
  const length = production.RHS.symbols.length;
  const reducedParseTree = state.parseTrees.slice(0, -length);
  const replacedSlice = state.parseTrees.slice(-length);
  reducedParseTree.push({node: production.LHS, children: replacedSlice});
  state.parseTrees = reducedParseTree;

  state.automaton.reset();
  for (const s of state.parseTrees.map(pt => pt.node)) {
    if (s === cfg.startSymbol) {
      state.isCompleted = true;
      break;
    }
    state.automaton.jump(psSerialize(s));
  }
  return state;
};

const findProduction = (state: BUState): Production => {
  const pwps = [...state.automaton.getCurrentState().pwps];
  if (pwps.length > 1) {
    throw new Error(
      'Many Productions can be the handle.' + state.automaton.getCurrentState()
    );
  }
  return pwps[0].production;
};

export const parseWithLR0 = (
  sentence: Sentence,
  cfg: ContextFreeGrammar
): ParseTree => {
  const remainingSentence = [...sentence];
  const parseTrees: ParseTree[] = [];
  let state: BUState = {
    remainingSentence,
    parseTrees,
    cfg,
    automaton: buildAutomaton(cfg),
    isCompleted: false,
  };
  let seq = 0;
  while (true) {
    seq++;
    if (seq > 40) {
      throw new Error('Too much parsing.');
    }
    // find if you need to shift or reduce.
    if (canShift(state)) {
      state = shift(state);
      continue;
    }
    // which production must be taken ?
    const production = findProduction(state);
    state = reduce(state, production);
    if (state.isCompleted) {
      break;
    }
  }

  return state.parseTrees[0];
};
