import {getRoot, getSubTree} from './adjacency-list';

export interface AdjacencyList {
  [node: number]: number[];
}

export type NodeMap<T> = Map<number, T>;

export class Tree<T> {
  static fromAdjacenceList(adjacencyList: AdjacencyList): Tree<number> {
    const root = getRoot(adjacencyList);
    return new Tree<number>(
      root,
      adjacencyList[root].map(c =>
        Tree.fromAdjacenceList(getSubTree(adjacencyList, c))
      )
    );
  }

  static fromAdjacenceListAndNodeMap<T>(
    adjacencyList: AdjacencyList,
    nodeMap: NodeMap<T>
  ): Tree<T> {
    const root = getRoot(adjacencyList);
    const rootNode = nodeMap.get(root);
    if (!rootNode) {
      throw new Error('Cannot get node for id = ' + root);
    }
    return new Tree<T>(
      rootNode,
      adjacencyList[root].map(c =>
        Tree.fromAdjacenceListAndNodeMap<T>(
          getSubTree(adjacencyList, c),
          nodeMap
        )
      )
    );
  }

  constructor(private node: T, private children: Tree<T>[] = []) {}
  getNode() {
    return this.node;
  }
  getChildren() {
    return this.children;
  }
  toObject(): Object {
    return {
      n: this.node,
      c: this.children.map(c => c.toObject()),
    };
  }

  toString() {
    return JSON.stringify(this.toObject());
  }

  flatten(): Array<T> {
    if (this.children.length === 0) {
      return [this.node];
    }
    return this.children
      .map(c => c.flatten())
      .reduce((acc, n) => acc.concat(n), []);
  }
}
