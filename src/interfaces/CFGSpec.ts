import {Alphabet} from '@jlguenego/language';
import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';
import {ProductionSpec} from './Production';

export type CFGSpec = CFGSpecifications<NonTerminalAlphabet, TerminalAlphabet>;

export interface CFGSpecifications<NT, T> {
  nt: NT;
  t: T;
  productions: ProductionSpec<T, NT>[];
  startSymbol: keyof NT & string;
}

// just check some typings for ContextFreeGrammar, but not all.
export type CFGSpecInput = {
  nt: Alphabet;
  t: Alphabet;
  productions: {LHS: string; RHS: string[]}[];
  startSymbol: string;
};
