export const arrayRemove = (array: unknown[], itemsToBeRemoved: unknown[]) => {
  for (const it of itemsToBeRemoved) {
    const index = array.indexOf(it);
    if (index === -1) {
      continue;
    }
    array.splice(index, 1);
  }
};
