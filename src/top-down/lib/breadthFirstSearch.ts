export type BFSTreeTestValueFn<T> = (value: T) => boolean;
export type BFSTreeGetChildrenFn<T> = (value: T) => T[];

export class BFSTree<T> {
  constructor(
    private initValue: T,
    private test: BFSTreeTestValueFn<T>,
    private getChildren: BFSTreeGetChildrenFn<T>
  ) {}

  search(): T | undefined {
    const stack = [this.initValue];
    while (true) {
      const currentValue = stack.shift();
      if (currentValue === undefined) {
        return undefined;
      }
      if (this.test(currentValue)) {
        return currentValue;
      }
      const children = this.getChildren(currentValue);
      stack.push(...children);
    }
  }
}
