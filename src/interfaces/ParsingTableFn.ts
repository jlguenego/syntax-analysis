import {ParsingResultRule} from '../top-down/ParsingResultRule';
import {ParseSymbol} from './ParseSymbol';
import {Sentence} from './Sentence';

export enum ParsingResultEnum {
  POP,
  ACCEPT,
  ERROR,
}

export type ParsingResult = ParsingResultEnum | ParsingResultRule;

export type ParsingTableFn = (
  symbol: ParseSymbol,
  lookaheadString: Sentence
) => ParsingResult;
