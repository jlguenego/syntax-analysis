import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';

export const checkAlphabetAreDisjoint = (
  t: TerminalAlphabet,
  nt: NonTerminalAlphabet
): void => {
  const keyT = Object.keys(t);
  const setNT = new Set(Object.keys(nt));
  const intersection = new Set(keyT.filter(x => setNT.has(x)));
  if (intersection.size > 0) {
    throw new Error(
      'Terminal alphabet and nonterminal Alphabet must be disjoint'
    );
  }
};
