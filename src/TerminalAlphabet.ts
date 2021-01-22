import {Terminal} from './interfaces/Terminal';

export class TerminalAlphabet {
  static getClass<T extends string>(
    tlist: readonly T[]
  ): {new (): Record<T, Terminal>} {
    const result = (class extends TerminalAlphabet {
      constructor() {
        super();
        tlist.forEach(e => {
          ((this as unknown) as Record<T, Terminal>)[e] = {name: e} as Terminal;
        });
      }
    } as unknown) as {new (): Record<T, Terminal> & TerminalAlphabet};
    return result;
  }
}

export const tDef = <T extends string>(a: readonly T[]) =>
  new (TerminalAlphabet.getClass(a))();
