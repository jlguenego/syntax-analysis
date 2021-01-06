import assert from 'assert';
import {bfs} from '../src/index';

describe('BFS Unit Test', () => {
  it('test a simple graph', () => {
    assert.deepStrictEqual(bfs, 123);
  });
});
