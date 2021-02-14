import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';
import {ProductionSpec} from './Production';

export type CFGSpec = CFGSpecifications<TerminalAlphabet, NonTerminalAlphabet>;

export interface CFGSpecifications<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
> {
  nt: NT;
  t: T;
  startSymbol: keyof NT;
  productions: ProductionSpec<T, NT>[];
}

// just check some typings for ContextFreeGrammar, but not all.
export type CFGSpecInput = {
  nt: NonTerminalAlphabet;
  t: TerminalAlphabet;
  productions: {LHS: string; RHS: string[]}[];
  startSymbol: string;
};
