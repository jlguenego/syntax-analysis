import {Word} from './Word';
import {ParseSymbol} from './interfaces/ParseSymbol';
import {Production} from './interfaces/Production';
import {SententialForm} from './SententialForm';
import {Terminal} from './interfaces/Terminal';
import {NonTerminal} from './NonTerminal';
import {NonTerminalAlphabet} from './NonTerminalAlphabet';
import {TerminalAlphabet} from './TerminalAlphabet';
import {
  checkAlphabetAreDisjoint,
  getUnReachableProductionRule,
  removeUnreachableProductionRules,
} from './utils/check';
import {isLeftRecursiveNonTerminal} from './left-recursion/left-recursion';
import {buildFirst} from './top-down/lib/first';
import {buildFollow} from './top-down/lib/follow';
import {buildLL1Table} from './top-down/lib/LL1Table';
import {ParseError} from './ParseError';
import {CFGSpecifications} from './interfaces/CFGSpec';

export interface CFGOptions {
  ll1: boolean;
}

export class ContextFreeGrammar {
  startSymbol: NonTerminal;
  productions: Production[];

  // for better access performance
  productionMap = new Map<NonTerminal, SententialForm[]>();
  emptyProductionSet = new Set<NonTerminal>();

  // cache for FIRST and FOLLOW functions (top-down parsing, LL1)
  firstCache = new Map<NonTerminal, Set<Terminal>>();
  followCache = new Map<NonTerminal, Set<Terminal>>();
  ll1TableCache = new Map<NonTerminal, Map<string, number>>();

  firstkCache = new Map<NonTerminal, Set<Word>>();
  llkTableCache = new Map<NonTerminal, Map<Word, number>>();
  lookaheadTokenNbr = 0;

  options: CFGOptions = {
    ll1: false,
  };

  constructor(
    public spec: CFGSpecifications<TerminalAlphabet, NonTerminalAlphabet>,
    public t: TerminalAlphabet,
    public nt: NonTerminalAlphabet,
    opts: Partial<CFGOptions> = {}
  ) {
    this.options = {...this.options, ...opts};
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
      // const rhs = new SententialForm(
      //   symbols.length === 0 ? [epsilon] : symbols
      // );
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
    if (this.options.ll1) {
      buildLL1Table(this);
    }
  }

  check() {
    checkAlphabetAreDisjoint(this.t, this.nt);
    const rules = getUnReachableProductionRule(this.spec);
    this.spec = removeUnreachableProductionRules(this.spec, rules);
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

  getProdRHSArray(nt: NonTerminal): SententialForm[] {
    return this.productionMap.get(nt) as SententialForm[];
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
    return [...set];
  }

  getfromLL1Table(nt: NonTerminal, t: Terminal): SententialForm {
    const index = this.ll1TableCache.get(nt)?.get(t.name);
    if (index === undefined) {
      throw new ParseError('LL(1) Parser: Syntax Error.', t, nt);
    }
    return this.productions[index].RHS;
  }

  firstk(nt: NonTerminal): Set<Word> {
    const set = this.firstkCache.get(nt) as Set<Word>;
    return set;
  }

  getfromLLkTable(
    nt: NonTerminal,
    lookAheadTokens: Terminal[]
  ): SententialForm {
    const word = new Word(lookAheadTokens);
    for (let i = 0; i < word.terminals.length; i++) {
      const subword = new Word(
        word.terminals.slice(0, word.terminals.length - i)
      );
      const index = this.llkTableCache.get(nt)?.get(subword);
      if (index === undefined) {
        continue;
      }
      return this.productions[index].RHS;
    }

    throw new ParseError(
      `LL(${this.lookaheadTokenNbr}) Parser: Syntax Error.`,
      lookAheadTokens[0],
      nt
    );
  }
}
