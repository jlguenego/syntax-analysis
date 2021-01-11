import assert from 'assert';
import {AdjacencyList, Tree} from '../src/lib/Tree';

describe('Tree Unit Test', () => {
  it('test flatten tree', () => {
    const adjList: AdjacencyList = {
      1: ['2', '3', '4'],
      2: ['5', '6'],
      6: ['7', '8'],
    };

    const tree = Tree.fromAdjacenceList(adjList);

    const expectedTreeObject = {
      v: '1',
      c: [
        {
          v: '2',
          c: [{v: '5'}, {v: '6', c: [{v: '7'}, {v: '8'}]}],
        },
        {v: '3'},
        {v: '4'},
      ],
    };

    const actualTreeObject = tree.toObject();

    const flat = tree.flatten();
    console.log('flat: ', flat);

    assert.deepStrictEqual(actualTreeObject, expectedTreeObject);
    assert.deepStrictEqual(flat, ['5', '7', '8', '3', '4']);
  });
});
