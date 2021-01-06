export class Terminal {
  constructor(public name: string) {}
}

export const T = (str: string) => new Terminal(str);
