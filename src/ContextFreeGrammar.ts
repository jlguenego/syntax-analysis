import {epsilon} from './terminals/epsilon.terminal';
import {$} from './terminals/dollar.terminal';
import {ParseSymbol} from './interfaces/ParseSymbol';
import {Production, ProductionSpec} from './interfaces/Production';
import {SententialForm} from './interfaces/SententialForm';
import {Terminal} from './interfaces/Terminal';
import {NonTerminal} from './NonTerminal';
import {NonTerminalAlphabet} from './NonTerminalAlphabet';
import {TerminalAlphabet} from './TerminalAlphabet';
import {checkAlphabetAreDisjoint} from './utils';
import {isLeftRecursiveNonTerminal} from './left-recursion/left-recursion';

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
  productionMap = new Map<NonTerminal, SententialForm[]>();
  emptyProductionSet = new Set<NonTerminal>();
  followCache = new Map<NonTerminal, Terminal[]>();

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

  getProductions(nt: NonTerminal) {
    return this.productionMap.get(nt);
  }

  isLeftRecursive(nt: NonTerminal): boolean {
    return isLeftRecursiveNonTerminal(this, nt);
  }

  /**
   * For a given non-terminal/terminal `s`,
   * returns the list of all terminals
   * that are prefix to sentence that derives from `s`
   *
   * The following algorithm takes care about ε-productions.
   * https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/lectures/03/Slides03.pdf
   * slide 302
   *
   * Algo can be found at:
   * https://www.geeksforgeeks.org/first-set-in-syntax-analysis/
   *
   * @param {ParseSymbol} nt
   * @returns {Terminal[]}
   * @memberof ContextFreeGrammar
   */
  first(nt: ParseSymbol): Terminal[] {
    if (!(nt instanceof NonTerminal)) {
      return [nt];
    }

    const rhsArray = this.getProductions(nt);
    if (!rhsArray) {
      return [];
    }

    const result: Terminal[] = [];
    // test if s is a ε-productions
    if (this.isEmptyProduction(nt)) {
      result.push(epsilon);
    }

    for (const rhs of rhsArray) {
      for (const s of rhs.symbols) {
        // check infinite recursion
        if (s === nt) {
          if (this.isEmptyProduction(nt)) {
            continue;
          }
          break;
        }
        const firstYi = this.first(s);
        if (!firstYi.includes(epsilon)) {
          result.push(...firstYi);
          break;
        }
        result.push(...firstYi.filter(t => t !== epsilon));
      }
    }

    return result;
  }

  seq = 1;

  follow(B: NonTerminal): Terminal[] {
    console.log('follow start with B: ', B);
    this.seq++;
    if (this.seq > 50) {
      throw new Error('too much call of follow');
    }

    // cache
    if (this.followCache.has(B)) {
      console.log('sending from cache');
      return this.followCache.get(B) as Terminal[];
    }

    console.log('not cache. computing', B);

    if (B === this.startSymbol) {
      // starting symbol case (case 1)
      console.log('B is a start symbol', B);
      this.followCache.set(B, [$]);
      return this.followCache.get(B) as Terminal[];
    }

    const result: Terminal[] = [];

    // find all productions rules A -> pBq
    for (const p of this.productions) {
      const A = p.LHS;
      const rhs = p.RHS;
      const index = rhs.symbols.findIndex(s => s === B);
      if (index === -1) {
        console.log('B is not found');
        continue;
      }
      if (index === rhs.symbols.length - 1) {
        console.log('B is found at last: A -> PB');
        // productions A -> PB : follow(B) = follow(A)
        const followA = this.follow(A).filter(t => result.includes(t));
        result.push(...followA);
        continue;
      }

      // A -> pBq : follow(B) = first(q) - epsilon
      const q = rhs.symbols[index + 1];
      const firstQ = this.first(q);
      if (firstQ.includes(epsilon)) {
        result.push(...firstQ.filter(t => t !== epsilon));
        const followA = this.follow(A).filter(t => result.includes(t));
        result.push(...followA);
        continue;
      }
      result.push(...firstQ);
    }
    console.log('finished B with result', B, result);

    this.followCache.set(B, result);
    return this.followCache.get(B) as Terminal[];
  }
}
