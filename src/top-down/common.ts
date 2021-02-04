import {PartialParseTree} from '../PartialParseTree';
import {Sentence} from '../interfaces/Sentence';

let seq = 0;

export const testFn = (sentence: Sentence) => (
  ppt: PartialParseTree
): boolean => {
  seq++;
  if (seq > 10000) {
    seq = 0;
    throw new Error('too much. stop');
  }
  if (ppt.sententialForm.isEqualsToSentence(sentence)) {
    seq = 0;
    return true;
  }
  return false;
};

export const testFnAsync = (sentence: Sentence) => async (
  ppt: PartialParseTree
): Promise<boolean> => {
  if (ppt.sententialForm.isEqualsToSentence(sentence)) {
    return true;
  }
  return false;
};
