import {PartialParseTree} from '../PartialParseTree';
import {Sentence} from '../interfaces/Sentence';

let seq = 0;

export const testFn = (sentence: Sentence) => (
  ppt: PartialParseTree
): boolean => {
  seq++;
  if (seq > 1000) {
    seq = 0;
    throw new Error('too much. stop');
  }
  // console.log(
  //   'ppt.sententialForm: ',
  //   sententialFormToString(ppt.sententialForm)
  // );
  if (ppt.sententialForm.isEqualsToSentence(sentence)) {
    console.log('seq: ', seq);
    seq = 0;
    return true;
  }
  return false;
};