import {Terminal} from './interfaces/Terminal';
import {NonTerminal} from './NonTerminal';

export class ParseError extends Error {
  constructor(
    message: string,
    public t: Terminal,
    public nt: NonTerminal | undefined = undefined
  ) {
    super(message);
  }
}
