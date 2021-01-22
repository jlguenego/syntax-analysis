import {NonTerminal} from './NonTerminal';

export class NonTerminalAlphabet {
  static getClass<T extends string>(
    tlist: readonly T[]
  ): {new (): Record<T, NonTerminal>} {
    const result = (class extends NonTerminalAlphabet {
      constructor() {
        super();
        tlist.forEach(e => {
          ((this as unknown) as Record<T, NonTerminal>)[e] = new NonTerminal(e);
        });
      }
    } as unknown) as {new (): Record<T, NonTerminal> & NonTerminalAlphabet};
    return result;
  }
}

export const defineNonTerminalAlphabet = <T extends string>(a: readonly T[]) =>
  new (NonTerminalAlphabet.getClass(a))();
