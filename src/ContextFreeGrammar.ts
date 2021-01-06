import {Production} from './interfaces/Production';
import {NonTerminal} from './NonTerminal';

export interface CFGSpec {
  startSymbol: NonTerminal;
  productions: Production[];
}

export class ContextFreeGrammar {
  startSymbol: NonTerminal;
  productions: Production[];
  constructor(spec: CFGSpec) {
    this.startSymbol = spec.startSymbol;
    this.productions = spec.productions;
  }
}
