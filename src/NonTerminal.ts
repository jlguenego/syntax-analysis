const cache: NonTerminal[] = [];

export const NT_PREFIX = 'NT_';

export class NonTerminal {
  public label!: string;
  constructor(label: string) {
    const nt = cache.find(e => e.label === label);
    if (nt) {
      return nt;
    }
    cache.push(this);
    this.label = label;
  }
  toString() {
    return this.label;
  }
  serialize() {
    return NT_PREFIX + this.label;
  }
}
