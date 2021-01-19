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
    // note that if a transition already exists, it is replaced.
    // so no need to check if there is already a transition.
    this.states.add(from);
    this.states.add(to);
    let map = this.transitions.get(from);
    if (map === undefined) {
      map = new Map<T, S>();
      this.transitions.set(from, map);
    }
    map.set(symbol, to);
  }

  hasTransition(from: S, symbol: T): S | undefined {
    // returns undefined if no state or transition are found.
    return this.transitions.get(from)?.get(symbol);
  }

  getSize() {
    return this.states.size;
  }

  getStateArray() {
    return [...this.states];
  }
}
