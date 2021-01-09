import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';

export type SententialForm<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
> = (T[keyof T] | NT[keyof NT])[];
