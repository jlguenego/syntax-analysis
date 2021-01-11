import {AdjacencyList} from './Tree';

export function getRoot(t: AdjacencyList): string {
  const children: string[] = Object.values(t).reduce(
    (acc, n) => acc.concat(n),
    []
  );
  for (const p of Object.keys(t)) {
    if (!children.includes(p)) {
      return p;
    }
  }
  throw new Error('Cannot find a root for this tree: ' + JSON.stringify(t));
}

export function getSubTree(t: AdjacencyList, n: string): AdjacencyList {
  if (t[n] === undefined) {
    return {
      [n]: [],
    };
  }
  return t[n].reduce((acc, c) => ({...acc, ...getSubTree(t, c)}), {
    [n]: t[n],
  });
}

export function flatten(t: AdjacencyList): Array<string> {
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
