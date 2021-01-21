import {LALR1State} from '../bottom-up/lib/LALR1State';
import {LR0State} from '../bottom-up/lib/LR0State';
import {LR1State} from '../bottom-up/lib/LR1State';

export type LRState = LR0State | LR1State | LALR1State;
