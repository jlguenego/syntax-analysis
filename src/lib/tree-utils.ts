import {Tree} from '../interfaces/Tree';

export function getRoot(t: Tree): number {
  const children: number[] = Object.values(t).reduce(
    (acc, n) => acc.concat(n),
    []
  );
  for (const p of Object.keys(t)) {
    if (!children.includes(+p)) {
      return +p;
    }
  }
  throw new Error('Cannot find a root for this tree: ' + JSON.stringify(t));
}

export function getSubTree(t: Tree, n: number): Tree {
  if (t[n] === undefined) {
    return {
      [n]: [],
    };
  }
  return t[n].reduce((acc, c) => ({...acc, ...getSubTree(t, c)}), {
    [n]: t[n],
  });
}

export function flatten(t: Tree): Array<number> {
  if (Object.keys(t).length === 0) {
    return [];
  }
  const root = getRoot(t);
  const children = t[root];
  if (children.length > 0) {
    return children
      .map(n => flatten(getSubTree(t, n)))
      .reduce((acc, n) => acc.concat(n), []);
  }
  return [root];
}
