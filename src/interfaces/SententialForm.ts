import {NonTerminal} from '../NonTerminal';
import {ParseSymbol} from './ParseSymbol';
import {Sentence} from './Sentence';

export type SententialForm = ParseSymbol[];

export function isSentence(form: SententialForm): form is Sentence {
  for (const s of form) {
    if (s instanceof NonTerminal) {
      return false;
    }
  }
  return true;
}

export function sententialFormToString(form: SententialForm): string {
  return form
    .map(s => {
      if (s instanceof NonTerminal) {
        return s.label;
      }
      return s.name;
    })
    .join('');
}

export function hasOnlyNonTerminal(
  form: SententialForm
): form is NonTerminal[] {
  for (const s of form) {
    if (!(s instanceof NonTerminal)) {
      return false;
    }
  }
  return true;
}
