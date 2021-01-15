import {epsilon} from './epsilonTerminal';
import {ParseSymbol} from './interfaces/ParseSymbol';
import {Production, ProductionSpec} from './interfaces/Production';
import {SententialForm} from './interfaces/SententialForm';
import {Terminal} from './interfaces/Terminal';
import {NonTerminal} from './NonTerminal';
import {NonTerminalAlphabet} from './NonTerminalAlphabet';
import {TerminalAlphabet} from './TerminalAlphabet';

export interface CFGSpec<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
> {
  startSymbol: keyof NT;
  productions: ProductionSpec<T, NT>[];
}

export class ContextFreeGrammar<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
> {
  startSymbol: NonTerminal;
  productions: Production[];
  productionMap = new Map<NonTerminal, SententialForm[]>();
  emptyProductionSet = new Set<NonTerminal>();
  constructor(spec: CFGSpec<T, NT>, t: T, nt: NT) {
    this.startSymbol = (nt[spec.startSymbol] as unknown) as NonTerminal;
    this.productions = spec.productions.map(p => {
      const rhs: (Terminal | NonTerminal)[] = p.RHS.map(
        c =>
          ((nt[c as keyof NT] as unknown) as NonTerminal) ??
          ((t[c as keyof T] as unknown) as Terminal)
      );
      const lhs = (nt[p.LHS] as unknown) as NonTerminal;
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
      if (p.RHS.length === 0) {
        this.emptyProductionSet.add(p.LHS);
      }
    }
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

  isProduction(nt: NonTerminal) {
    return this.productionMap.has(nt);
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

    const result: Terminal[] = [];
    // test if s is a ε-productions
    if (this.isEmptyProduction(nt)) {
      result.push(epsilon);
    }

    const rhsArray = this.getProductions(nt);
    if (!rhsArray) {
      return result;
    }

    for (const rhs of rhsArray) {
      for (const s of rhs) {
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
}
