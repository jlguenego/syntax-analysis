import {Production} from './interfaces/Production';
import {NonTerminalAlphabet} from './NonTerminalAlphabet';
import {TerminalAlphabet} from './TerminalAlphabet';

export interface CFGSpec<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
> {
  startSymbol: NT[keyof NT];
  productions: Production<T, NT>[];
}

export class ContextFreeGrammar<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
> {
  startSymbol: NT[keyof NT];
  productions: Production<T, NT>[];
  constructor(spec: CFGSpec<T, NT>) {
    this.startSymbol = spec.startSymbol;
    this.productions = spec.productions;
  }
}
