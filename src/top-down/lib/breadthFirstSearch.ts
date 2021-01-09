export interface BFSTree<T> {
  value: T;
  equals(actual: T, expected: T): boolean;
  getChildren(): T[];
  parent?: BFSTree<T>;
  root?: BFSTree<T>;
}

export const breadthFirstSearch = <T>(tree: BFSTree<T>): BFSTree<T> => {
  return tree;
};
