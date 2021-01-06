import {NonTerminal} from '../NonTerminal';
import {Terminal} from '../Terminal';

export interface Production {
  LHS: NonTerminal;
  RHS: (Terminal | NonTerminal)[];
}
