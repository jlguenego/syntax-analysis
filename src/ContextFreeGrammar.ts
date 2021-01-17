import {ParseSymbol} from './interfaces/ParseSymbol';
import {Production, ProductionSpec} from './interfaces/Production';
import {SententialForm} from './SententialForm';
import {Terminal} from './interfaces/Terminal';
import {NonTerminal} from './NonTerminal';
import {NonTerminalAlphabet} from './NonTerminalAlphabet';
import {TerminalAlphabet} from './TerminalAlphabet';
import {checkAlphabetAreDisjoint} from './utils';
import {isLeftRecursiveNonTerminal} from './left-recursion/left-recursion';
import {buildFirst} from './first';
import {buildFollow} from './follow';

export interface CFGSpecifications<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
> {
  startSymbol: keyof NT;
  productions: ProductionSpec<T, NT>[];
}

export type CFGSpec = CFGSpecifications<TerminalAlphabet, NonTerminalAlphabet>;

export class ContextFreeGrammar {
  startSymbol: NonTerminal;
  productions: Production[];

  // for better access performance
  productionMap = new Map<NonTerminal, SententialForm[]>();
  emptyProductionSet = new Set<NonTerminal>();

  // cache for FIRST and FOLLOW functions (top-down parsing, LL1)
  firstCache = new Map<NonTerminal, Set<Terminal>>();
  followCache = new Map<NonTerminal, Set<Terminal>>();

  constructor(
    spec: CFGSpecifications<TerminalAlphabet, NonTerminalAlphabet>,
    public t: TerminalAlphabet,
    public nt: NonTerminalAlphabet
  ) {
    this.check();
    this.startSymbol = (nt[spec.startSymbol] as unknown) as NonTerminal;
    this.productions = spec.productions.map(p => {
      const lhs = (nt[p.LHS] as unknown) as NonTerminal;
      const rhs = new SententialForm(
        p.RHS.map(
          c =>
            ((nt[c] as unknown) as NonTerminal) ??
            ((t[c] as unknown) as Terminal)
        )
      );
      return {
        LHS: lhs,
        RHS: rhs,
      };
    });
    for (const p of this.productions) {
      if (this.productionMap.has(p.LHS)) {
        this.productionMap.get(p.LHS)?.push(p.RHS);
      } else {
        this.productionMap.set(p.LHS, [p.RHS]);
      }
      if (p.RHS.symbols.length === 0) {
        this.emptyProductionSet.add(p.LHS);
      }
    }
    buildFirst(this);
    buildFollow(this);
  }

  check() {
    checkAlphabetAreDisjoint(this.t, this.nt);
  }

  hasEmptyProduction(): boolean {
    return this.emptyProductionSet.size > 0;
  }

  // https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/lectures/03/Slides03.pdf
  // Slide 164
  getLL1Table() {
    return;
  }

  isEmptyProduction(nt: NonTerminal): boolean {
    return this.emptyProductionSet.has(nt);
  }

  getProdRHSArray(nt: NonTerminal) {
    return this.productionMap.get(nt);
  }

  isLeftRecursive(nt: NonTerminal): boolean {
    return isLeftRecursiveNonTerminal(this, nt);
  }

  /**
   *
   *
   * @param {ParseSymbol} nt
   * @returns {Terminal[]}
   * @memberof ContextFreeGrammar
   */
  first(nt: ParseSymbol): Terminal[] {
    if (!(nt instanceof NonTerminal)) {
      return [nt];
    }
    const set = this.firstCache.get(nt) as Set<Terminal>;
    return [...set].sort();
  }
}
