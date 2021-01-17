import {Terminal} from '../interfaces/Terminal';

/**
 * $ terminal represents the end of a sentence, similarly to the regular expression.
 * $ terminal is used for computing the FOLLOW function.
 *
 * slide 168
 * https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/lectures/03/Slides03.pdf
 *
 * @export
 * @interface Terminal
 */
export const dollar: Terminal = {
  name: '$',
};
