import {Terminal} from './interfaces/Terminal';
import {NonTerminal} from './NonTerminal';

export class ParseError extends Error {
  constructor(message: string, public nt: NonTerminal, public t: Terminal) {
    super(message);
  }
}
