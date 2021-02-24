import {Tree} from '@jlguenego/tree';

import {epsilon} from '../terminals/epsilon.terminal';
import {ParseSymbol} from '../interfaces/ParseSymbol';
import {ContextFreeGrammar} from '../ContextFreeGrammar';
import {OutputTape} from '../interfaces/OutputTape';
import {NonTerminal} from '../NonTerminal';
import {Sentence} from '../interfaces/Sentence';

export const convertInputTapeToTree = (
  cfg: ContextFreeGrammar,
  outputTape: OutputTape,
  inputTape: Sentence
): Tree<ParseSymbol> => {
  const tree = new Tree<ParseSymbol>(cfg.startSymbol);
  for (const i of outputTape) {
    const prod = cfg.productions[i];
    const nt = prod.LHS;
    const stock = tree.getLeaves().find(t => t.node instanceof NonTerminal);
    if (!stock) {
      throw new Error(
        `Cannot convert outputTape: nonterminal ${nt.label} not found.`
      );
    }
    if (prod.RHS.symbols.length === 0) {
      tree.graft(stock, new Tree<ParseSymbol>(epsilon));
    }
    for (const s of prod.RHS.symbols) {
      const scion = new Tree<ParseSymbol>(s);
      tree.graft(stock, scion);
    }
  }
  let i = 0;
  for (const leaf of tree.getLeaves()) {
    if (leaf.node === epsilon) {
      continue;
    }
    if (leaf.node instanceof NonTerminal) {
      throw new Error('should not happen.');
    }
    if (leaf.node.name !== inputTape[i].name) {
      throw new Error('name are not equals. Technical bug?');
    }
    leaf.node = inputTape[i];
    i++;
  }
  return tree;
};
