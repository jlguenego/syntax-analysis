export class Automaton<S extends Object, T> {
  private states = new Set<S>();
  private transitions = new Map<S, Map<T, S>>();
  constructor() {}

  toObject() {
    return {
      states: [...this.states].map(s => s.toString()),
      // transitions: [...this.transitions].map(t => t),
    };
  }

  addState(state: S) {
    this.states.add(state);
    this.transitions.set(state, new Map<T, S>());
  }

  addTransition(from: S, to: S, symbol: T) {
    const map = this.transitions.get(from) as Map<T, S>;
    map.set(symbol, to);
  }

  goto(from: S, symbol: T): S | undefined {
    return this.transitions.get(from)?.get(symbol);
  }

  getSize() {
    return this.states.size;
  }
}
