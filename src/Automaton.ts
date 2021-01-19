export class Automaton<S extends {id: number}> {
  private states = new Set<S>();
  private transitions = new Map<S, Map<string, S>>();
  constructor() {}

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

  hasTransition(from: S, symbol: string): S | undefined {
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
