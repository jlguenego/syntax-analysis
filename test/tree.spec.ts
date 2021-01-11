import assert from 'assert';
import {Tree} from '../src/lib/Tree';

describe('Tree Unit Test', () => {
  it('test flatten tree', () => {
    // const treeSpec = {
    //   n: 1,
    //   c: [
    //     {
    //       n: 2,
    //       c: [{n: 5}, {n: 6}],
    //     },
    //     {n: 3},
    //     {n: 4},
    //   ],
    // };
    const adjList = {
      1: [2, 3, 4],
      2: [5, 6],
      6: [7, 8],
    };

    const tree = Tree.fromAdjacenceList(adjList);

    const flat = tree.flatten();
    console.log('flat: ', flat);

    assert.deepStrictEqual(flat, [5, 7, 8, 3, 4]);
  });
});
