import {SententialForm} from '../SententialForm';
import {ProductionIndex} from './lib/KPredictiveParser';

export class ParsingResultRule {
  constructor(public i: ProductionIndex, public beta: SententialForm) {}
}
