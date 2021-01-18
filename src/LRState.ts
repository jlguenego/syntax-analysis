import {ContextFreeGrammar} from './ContextFreeGrammar';
import {ParseSymbol} from './interfaces/ParseSymbol';
import {NonTerminal} from './NonTerminal';
import {ProductionWithPosition} from './ProductionWithPosition';

export class LRState {
  static seq = 0;
  id: number;
  constructor(
    public cfg: ContextFreeGrammar,
    public pwps: Set<ProductionWithPosition>
  ) {
    LRState.seq++;
    this.id = LRState.seq;
    this.computeClosure();
  }
  computeClosure() {
    let previousSize = -1;
    let size = this.pwps.size;
    while (size > previousSize) {
      for (const pwp of this.pwps) {
        const nextSymbol = pwp.getNextSymbol();
        if (!(nextSymbol instanceof NonTerminal)) {
          continue;
        }
        this.cfg.productions
          .filter(p => p.LHS === nextSymbol)
          .forEach(p => {
            this.pwps.add(new ProductionWithPosition(p, 0));
          });
      }

      previousSize = size;
      size = this.pwps.size;
    }
  }

  toString() {
    return `[${this.id}] ` + [...this.pwps].map(p => p.toString()).join(' ');
  }

  getSymbolTransitions(): ParseSymbol[] {
    return [...this.pwps].map(pwp => pwp.getNextSymbol());
  }
}
