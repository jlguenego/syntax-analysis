import {NonTerminal} from '../NonTerminal';
import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';
import {SententialForm} from '../SententialForm';

export interface ProductionSpec<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
> {
  LHS: keyof NT;
  RHS: (keyof T | keyof NT)[];
}

export interface Production {
  LHS: NonTerminal;
  RHS: SententialForm;
}
