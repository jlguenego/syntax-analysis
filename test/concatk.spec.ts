import {emptyWord} from '@jlguenego/language';
import assert from 'assert';
import {
  concatk,
  defineTerminalAlphabet,
  newTWord,
  wordSetToString,
} from '../src';

const t = defineTerminalAlphabet(['a', 'b', 'c', 'd'] as const);

describe('Concatk Unit Test', () => {
  it('test no arg', () => {
    const k = 2;
    const set = concatk(k);
    assert.deepStrictEqual(set.size, 0);
    assert.deepStrictEqual(wordSetToString(set), '');
  });
  it('test 1 arg', () => {
    const k = 2;
    const s1 = new Set([newTWord([t.a])]);
    const set = concatk(k, s1);
    assert.deepStrictEqual(set.size, 1);
    assert.deepStrictEqual(wordSetToString(set), 'a');
  });
  it('test 1 arg epsilon', () => {
    const k = 2;
    const s1 = new Set([emptyWord]);
    const set = concatk(k, s1);
    assert.deepStrictEqual(set.size, 1);
    assert.deepStrictEqual(wordSetToString(set), 'ε');
  });
  it('test 2 arg', () => {
    const k = 2;
    const s1 = new Set([newTWord([t.a])]);
    const s2 = new Set([newTWord([t.b])]);
    const set = concatk(k, s1, s2);
    assert.deepStrictEqual(set.size, 1);
    assert.deepStrictEqual(wordSetToString(set), 'ab');
  });
  it('test 2 args with epsilon', () => {
    const k = 2;
    const s1 = new Set([emptyWord, newTWord([t.a])]);
    const s2 = new Set([newTWord([t.b])]);
    const set = concatk(k, s1, s2);
    assert.deepStrictEqual(set.size, 2);
    assert.deepStrictEqual(wordSetToString(set), 'b,ab');
  });
  it('test 2 args with 2 epsilons', () => {
    const k = 2;
    const s1 = new Set([emptyWord, newTWord([t.a])]);
    const s2 = new Set([emptyWord, newTWord([t.b])]);
    const set = concatk(k, s1, s2);

    assert.deepStrictEqual(set.size, 4);
    assert.deepStrictEqual(wordSetToString(set), 'ε,b,a,ab');
  });
  it('test 3 args with epsilon', () => {
    const k = 3;
    const s1 = new Set([emptyWord, newTWord([t.a])]);
    const s2 = new Set([emptyWord, newTWord([t.b])]);
    const s3 = new Set([emptyWord, newTWord([t.c])]);
    const set = concatk(k, s1, s2, s3);

    assert.deepStrictEqual(set.size, 8);
    assert.deepStrictEqual(wordSetToString(set), 'ε,c,b,bc,a,ac,ab,abc');
  });
  it('test 3 args with epsilon with k === 2', () => {
    const k = 2;
    const s1 = new Set([emptyWord, newTWord([t.a])]);
    const s2 = new Set([emptyWord, newTWord([t.b])]);
    const s3 = new Set([emptyWord, newTWord([t.c])]);
    const set = concatk(k, s1, s2, s3);

    assert.deepStrictEqual(set.size, 7);
    assert.deepStrictEqual(wordSetToString(set), 'ε,c,b,bc,a,ac,ab');
  });
  it('test 3 args with epsilon with k === 1', () => {
    const k = 1;
    const s1 = new Set([emptyWord, newTWord([t.a])]);
    const s2 = new Set([emptyWord, newTWord([t.b])]);
    const s3 = new Set([emptyWord, newTWord([t.c])]);
    const set = concatk(k, s1, s2, s3);

    assert.deepStrictEqual(set.size, 4);
    assert.deepStrictEqual(wordSetToString(set), 'ε,c,b,a');
  });
});
