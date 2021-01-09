import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';

export interface Production<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
> {
  LHS: NT[keyof NT];
  RHS: (T[keyof T] | NT[keyof NT])[];
}
