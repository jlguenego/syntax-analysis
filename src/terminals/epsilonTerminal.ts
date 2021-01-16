import {Terminal} from '../interfaces/Terminal';

/**
 * Some CFG has ε-production (rules with RHS empty).
 * when this occurs we may need a special terminal
 * symbol called epsilon, or null symbol to indicate it.
 *
 * slide 283
 * https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/lectures/03/Slides03.pdf
 *
 * @export
 * @interface Terminal
 */
export const epsilon: Terminal = {
  name: '',
};
