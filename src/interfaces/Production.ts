import {Alphabet} from './Alphabet';

export interface Production {
  LHS: string;
  RHS: Alphabet[];
}
