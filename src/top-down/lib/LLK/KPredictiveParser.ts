import {dollar} from './../../../terminals/dollar.terminal';
import {ParseError} from '../../../ParseError';
import {ParseSymbol} from '../../../interfaces/ParseSymbol';
import {ParseTree} from '../../../interfaces/ParseTree';
import {Sentence} from '../../../interfaces/Sentence';
import {ContextFreeGrammar} from '../../../ContextFreeGrammar';
import {ParsingResultRule} from '../../ParsingResultRule';
import {buildLLkParsingTable} from './buildLLkParsingTable';
import {ParsingTableFn} from '../../../interfaces/ParsingTableFn';
import {getT0} from './buildLLkTables';
import {ProductionIndex} from '../../../interfaces/ProductionIndex';
import {convertInputTapeToTree} from '../../../utils/convert';
import {ParsingResultEnum} from '../../../interfaces/ParsingResultEnum';
import {inspect} from 'util';

export interface ParserConfiguration {
  unusedPortion: Sentence;
  pushdownList: ParseSymbol[];
  outputTape: ProductionIndex[];
}

// See Aho Ullman 5.1.2 (page 338) Predictive Parsing Algorithm.

export class KPredictiveParser {
  outputTape: ProductionIndex[] = [];
  pushdownList!: ParseSymbol[];
  parsingTable!: ParsingTableFn;
  isFinished = false;

  inputTapeCursor = 0;
  constructor(
    public cfg: ContextFreeGrammar,
    public k: number,
    public inputTape: Sentence
  ) {
    this.buildParsingTable();
    this.resetPushdownList();
  }

  buildParsingTable() {
    this.parsingTable = buildLLkParsingTable(this.cfg, this.k);
  }

  /**
   * Set the pushdownlist to S$ (LL1 or Strong LLK) or T0$ (LLK)
   *
   * @abstract
   * @memberof KPredictiveParser
   */
  resetPushdownList(): void {
    this.pushdownList = [getT0(this.cfg, this.k), dollar];
  }

  reset() {
    this.outputTape = [];
    this.inputTapeCursor = 0;
    this.resetPushdownList();
  }

  getLookaheadString(): Sentence {
    // firstk(x)
    return this.inputTape.slice(
      this.inputTapeCursor,
      this.inputTapeCursor + this.k
    );
  }

  getLeftMostDerivation(): ParseTree {
    return {node: this.cfg.startSymbol, children: []};
  }

  getConfiguration(): ParserConfiguration {
    return {
      unusedPortion: this.inputTape.slice(this.inputTapeCursor),
      pushdownList: this.pushdownList,
      outputTape: this.outputTape,
    };
  }

  move(): void {
    const X = this.pushdownList[0];
    const u = this.getLookaheadString();
    const M = this.parsingTable;
    const nextMove = M(X, u);
    if (nextMove instanceof ParsingResultRule) {
      // replace the top symbol X with nextMove.beta
      this.pushdownList = [
        ...nextMove.beta.symbols,
        ...this.pushdownList.slice(1),
      ];
      this.outputTape.push(nextMove.i);
      return;
    }
    if (nextMove === ParsingResultEnum.POP) {
      this.pushdownList = [...this.pushdownList.slice(1)];
      this.inputTapeCursor++;
      return;
    }
    if (nextMove === ParsingResultEnum.ACCEPT) {
      this.isFinished = true;
      return;
    }
    if (nextMove === ParsingResultEnum.ERROR) {
      throw new ParseError(
        'Syntax error',
        this.inputTape[this.inputTapeCursor]
      );
    }
  }

  run() {
    while (!this.isFinished) {
      this.move();
    }
    const tree = convertInputTapeToTree(this.cfg, this.outputTape);
    const parseTree = tree.toObject() as ParseTree;
    return parseTree;
  }
}
