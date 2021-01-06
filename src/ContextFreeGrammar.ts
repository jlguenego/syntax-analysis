import {Production} from './interfaces/Production';

export interface CFGSpec {
  startSymbol: string;
  productions: Production[];
}

export class ContextFreeGrammar {
  startSymbol: string;
  productions: Production[];
  constructor(spec: CFGSpec) {
    this.startSymbol = spec.startSymbol;
    this.productions = spec.productions;
  }
}
