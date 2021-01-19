export class Automaton<S extends {id: number}> {
  private states = new Set<S>();
  private transitions = new Map<S, Map<string, S>>();
  private currentState = this.startState;

  constructor(private startState: S) {
    this.addState(startState);
    this.reset();
  }

  reset(state = this.startState): void {
    this.currentState = state;
  }

  toObject() {
    return {
      states: [...this.states].map(s => s.toString()),
      transitions: [...this.transitions.keys()].map(fromState => {
        const fromId = fromState.id;
        const map = this.transitions.get(fromState) as Map<string, S>;
        const result: string[] = [];
        for (const [trans, {id: toId}] of map.entries()) {
          result.push(`${fromId}->${trans}->${toId}`);
        }
        return result;
      }),
    };
  }

  addState(state: S) {
    this.states.add(state);
    this.transitions.set(state, new Map<string, S>());
  }

  addTransition(from: S, to: S, symbol: string) {
    // note that if a transition already exists, it is replaced.
    // so no need to check if there is already a transition.
    this.states.add(from);
    this.states.add(to);
    let map = this.transitions.get(from);
    if (map === undefined) {
      map = new Map<string, S>();
      this.transitions.set(from, map);
    }
    map.set(symbol, to);
  }

  getTransition(from: S, symbol: string): S | undefined {
    // returns undefined if no state or transition are found.
    return this.transitions.get(from)?.get(symbol);
  }

  getSize() {
    return this.states.size;
  }

  getStateArray() {
    return [...this.states];
  }

  hasCurrentTransitions() {
    const map = this.transitions.get(this.currentState);
    if (!map) {
      return false;
    }
    return map.size > 0;
  }

  getCurrentTransition(symbol: string) {
    return this.getTransition(this.currentState, symbol);
  }

  getCurrentState(): S {
    return this.currentState;
  }

  jump(symbol: string) {
    const state = this.getTransition(this.currentState, symbol);
    if (state === undefined) {
      throw new Error(
        `Cannot jump from stateId ${this.currentState.id} with symbol ${symbol}`
      );
    }
    this.currentState = state;
  }

  getStartState() {
    return this.startState;
  }
}
