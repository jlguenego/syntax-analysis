import {getRoot, getSubTree} from './adjacency-list';

export interface AdjacencyList {
  [node: string]: string[];
}

export interface TreeObject<T> {
  v: T;
  c?: TreeObject<T>[];
}

export type NodeMap<T> = Map<string, T>;

export class Tree<T> {
  static fromAdjacenceList(adjacencyList: AdjacencyList): Tree<string> {
    const root = getRoot(adjacencyList);
    return new Tree<string>(
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

  static fromObject<T>(to: TreeObject<T>): Tree<T> {
    if (to.c) {
      return new Tree<T>(
        to.v,
        to.c.map(c => Tree.fromObject<T>(c))
      );
    }
    return new Tree<T>(to.v);
  }

  constructor(private node: T, private children: Tree<T>[] = []) {}
  getNode() {
    return this.node;
  }
  getChildren() {
    return this.children;
  }
  toObject(): TreeObject<T> {
    const children = this.children.map(c => c.toObject());
    const result: TreeObject<T> = {
      v: this.node,
    };
    if (children.length > 0) {
      result.c = children;
    }
    return result;
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
