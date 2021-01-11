import {Terminal} from './Terminal';

export type Sentence = Terminal[];

export function sentenceEquals(s1: Sentence, s2: Sentence) {
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      return false;
    }
  }
  return true;
}
