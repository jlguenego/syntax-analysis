import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';

export type SententialForm<
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
> = (T[keyof T] | NT[keyof NT])[];

export const areSententialFormEquals = <
  T extends TerminalAlphabet,
  NT extends NonTerminalAlphabet
>(
  a: SententialForm<T, NT>,
  b: SententialForm<T, NT>
) => {
  for (let i = 0; i < a.length; i++) {
    // equal by reference because all alphabet letters are the same ref in memory.
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};
