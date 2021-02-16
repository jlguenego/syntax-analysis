import {ProductionIndex} from '../interfaces/ProductionIndex';
import {SententialForm} from '../SententialForm';

export class ParsingResultRule {
  constructor(public i: ProductionIndex, public beta: SententialForm) {}
}
