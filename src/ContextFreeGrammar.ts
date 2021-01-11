import {Production, ProductionSpec} from './interfaces/Production';
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
  }
}
