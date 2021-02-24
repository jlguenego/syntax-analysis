import {Language} from '@jlguenego/language';
import {TWord} from './interfaces/TWord';
import {TerminalAlphabet} from './TerminalAlphabet';

export class WordSet extends Language<TerminalAlphabet> {
  constructor(set: Set<TWord>) {
    super(set);
  }
}
