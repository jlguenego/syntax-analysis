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
import {CFGSpec, CFGSpecInput} from './interfaces/CFGSpec';
import {LLKTables} from './LLKTables';

export interface CFGOptions {
  ll1: boolean;
}

export class ContextFreeGrammar {
  nt: NonTerminalAlphabet;
  t: TerminalAlphabet;
  startSymbol: NonTerminal;
  productions: Production[];

  spec: CFGSpec;

  // for better access performance
  productionMap = new Map<NonTerminal, SententialForm[]>();
  emptyProductionSet = new Set<NonTerminal>();

  // cache for FIRST and FOLLOW functions (top-down parsing, LL1)
  firstCache = new Map<NonTerminal, Set<Terminal>>();
  followCache = new Map<NonTerminal, Set<Terminal>>();
  ll1TableCache = new Map<NonTerminal, Map<string, number>>();

  // foreach k (of LL(k)) we set a cache.
  llkTableCache = new Map<number, LLKTables>();
  llkParsingTableCache = new Map<number, Map<NonTerminal, Map<Word, number>>>();
  firstCacheSet = new Map<number, Map<NonTerminal, Set<Word>>>();
  followCacheSet = new Map<number, Map<NonTerminal, Set<Word>>>();

  options: CFGOptions = {
    ll1: false,
  };

  constructor(spec: CFGSpecInput, opts: Partial<CFGOptions> = {}) {
    this.spec = spec as CFGSpec;
    this.nt = this.spec.nt;
    this.t = this.spec.t;
    this.options = {...this.options, ...opts};
    this.check();
    this.startSymbol = (this.nt[
      this.spec.startSymbol
    ] as unknown) as NonTerminal;
    this.productions = this.spec.productions.map(p => {
      const lhs = (this.nt[p.LHS] as unknown) as NonTerminal;
      const rhs = new SententialForm(
        p.RHS.map(
          c =>
            ((this.nt[c] as unknown) as NonTerminal) ??
            ((this.t[c] as unknown) as Terminal)
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

  firstk(k: number, nt: NonTerminal): Set<Word> {
    const set = this.firstCacheSet.get(k)?.get(nt) as Set<Word>;
    return set;
  }

  getfromLLkTable(
    k: number,
    nt: NonTerminal,
    lookAheadTokens: Terminal[]
  ): number {
    for (let i = 0; i < lookAheadTokens.length; i++) {
      const subword = Word.retrieve(
        lookAheadTokens.slice(0, lookAheadTokens.length - i)
      );

      if (!subword) {
        continue;
      }
      const index = this.llkParsingTableCache.get(k)?.get(nt)?.get(subword);

      if (index === undefined) {
        continue;
      }

      return index;
    }

    throw new ParseError(
      `LL(${k}) Parser: Syntax Error. terminal = ${lookAheadTokens[0].name}, nonterminal = ${nt.label}`,
      lookAheadTokens[0],
      nt
    );
  }
}
