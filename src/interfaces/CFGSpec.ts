import {Alphabet} from '@jlguenego/language';
import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';
import {ProductionSpec} from './Production';

export type CFGSpec = CFGSpecifications<TerminalAlphabet, NonTerminalAlphabet>;

export interface CFGSpecifications<T, NT> {
  nt: NT;
  t: T;
  startSymbol: keyof NT & string;
  productions: ProductionSpec<T, NT>[];
}

// just check some typings for ContextFreeGrammar, but not all.
export type CFGSpecInput = {
  nt: Alphabet;
  t: Alphabet;
  productions: {LHS: string; RHS: string[]}[];
  startSymbol: string;
};
