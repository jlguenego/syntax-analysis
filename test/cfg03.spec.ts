import {
  sentence03,
  cfg03,
  expectedParseTree03,
  expectedLLkParseTableString03,
  expectedLLkTableString03,
} from './data/aho_ullman/cfg0.3';
import assert from 'assert';
import {
  buildLLkParsingTable,
  buildLLkTables,
  getLLkParsingTableCache,
  getLLkTableCache,
  parse,
} from '../src';

describe('CFG03 Unit Test', () => {
  it('test cfg03_T0', () => {
    const k = 2;
    buildLLkTables(cfg03, k);
    assert.deepStrictEqual(
      getLLkTableCache(cfg03, k).toString(),
      expectedLLkTableString03
    );
  });
  it('test cfg03_ParseTable', () => {
    const k = 2;
    buildLLkParsingTable(cfg03, k);
    assert.deepStrictEqual(
      getLLkParsingTableCache(cfg03, k).toString(),
      expectedLLkParseTableString03
    );
  });
  it('test LLk_cfg03', async () => {
    buildLLkTables(cfg03, 2);
    const parseTree = parse(sentence03, cfg03, {
      method: 'LLk',
      lookaheadTokenNbr: 2,
    });
    assert.deepStrictEqual(parseTree, expectedParseTree03);
  });
});
