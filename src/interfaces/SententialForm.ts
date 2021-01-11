import {NonTerminal} from '../NonTerminal';
import {ParseSymbol} from './ParseSymbol';
import {Sentence} from './Sentence';

export type SententialForm = ParseSymbol[];

export function isSentence(form: SententialForm): form is Sentence {
  for (const s of form) {
    if (s instanceof NonTerminal) {
      console.log('not sentence');
      return false;
    }
  }
  console.log('is sentence sent found!');
  return true;
}
