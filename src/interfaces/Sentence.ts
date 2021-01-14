import {NonTerminal} from '../NonTerminal';
import {SententialForm} from './SententialForm';
import {Terminal} from './Terminal';

export type Sentence = Terminal[];

export function sentenceEquals(s1: Sentence, s2: SententialForm) {
  if (s1.length !== s2.length) {
    return false;
  }
  for (let i = 0; i < s1.length; i++) {
    if (s2[i] instanceof NonTerminal) {
      return false;
    }
  }
  for (let i = 0; i < s1.length; i++) {
    if (s1[i].name !== (s2[i] as Terminal).name) {
      return false;
    }
  }
  return true;
}
