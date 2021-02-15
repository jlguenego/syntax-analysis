import {SententialForm} from '../SententialForm';
import {ProductionIndex} from './lib/LLK/KPredictiveParser';

export class ParsingResultRule {
  constructor(public i: ProductionIndex, public beta: SententialForm) {}
}
