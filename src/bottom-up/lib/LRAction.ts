import {Production} from '../../interfaces/Production';

export type LRAction = ShiftAction | ReduceAction;

export class ShiftAction {}

export class ReduceAction {
  constructor(public production: Production) {}
}
