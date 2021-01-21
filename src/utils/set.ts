export const absorbSet = <T>(set1: Set<T>, set2: Set<T>): Set<T> => {
  [...set2].forEach(e => set1.add(e));
  return set1;
};

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
  return true;
};
