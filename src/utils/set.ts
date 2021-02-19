export const intersection = <T>(a: Set<T>, b: Set<T>) =>
  new Set([...a].filter(x => b.has(x)));

export const copyWithoutElt = <T>(set: Set<T>, ...elts: T[]) => {
  const result = new Set(set);
  elts.forEach(e => result.delete(e));
  return result;
};

export const areSetEquals = <T>(set1: Set<T>, set2: Set<T>): boolean => {
  if (set1.size !== set2.size) {
    return false;
  }
  for (const e of set1) {
    if (!set2.has(e)) {
      return false;
    }
  }
  for (const e of set2) {
    if (!set1.has(e)) {
      return false;
    }
  }
  return true;
};

export const getDistinctCouples = <T>(set: Set<T>): T[][] => {
  const result: T[][] = [];
  const remaining = new Set(set);
  for (const e of set) {
    remaining.delete(e);
    for (const f of remaining) {
      result.push([e, f]);
    }
  }
  return result;
};
