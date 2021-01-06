export class NonTerminal {
  constructor(public str: string) {}
}

export const P = (str: string) => new NonTerminal(str);
