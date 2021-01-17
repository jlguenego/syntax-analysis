export const absorbSet = <T>(set1: Set<T>, set2: Set<T>): void => {
  [...set2].forEach(e => set1.add(e));
};
