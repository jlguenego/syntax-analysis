import {getBFSTreeAsync} from './../src/top-down/BFS1';
import assert from 'assert';
import {cfg1, expectedParseTree, sentence} from './data/cfg1';
import {interval} from 'rxjs';
import {ParseTree} from '../src';

describe('Async Unit Test', () => {
  it('test async_BFS1_cfg1', async function () {
    this.timeout(10000);
    const bfstree = getBFSTreeAsync(sentence, cfg1, interval(1));
    bfstree.subject.subscribe();
    const pt = await bfstree.search();
    if (!pt) {
      assert.fail('parse tree not found');
    }
    const parseTree = pt.tree.toObject() as ParseTree;
    assert.deepStrictEqual(parseTree, expectedParseTree);
  });
});
