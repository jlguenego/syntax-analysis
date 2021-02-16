import {ParsingResultRule} from '../LLK/ParsingResultRule';
import {ParseSymbol} from './ParseSymbol';
import {ParsingResultEnum} from './ParsingResultEnum';
import {Sentence} from './Sentence';

export type ParsingResult = ParsingResultEnum | ParsingResultRule;

export type ParsingTableFn = (
  symbol: ParseSymbol,
  lookaheadString: Sentence
) => ParsingResult;
