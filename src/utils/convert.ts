import {epsilon} from './../terminals/epsilon.terminal';
import {ParseSymbol} from './../interfaces/ParseSymbol';
import {ContextFreeGrammar} from './../ContextFreeGrammar';
import {OutputTape} from './../interfaces/OutputTape';
import {Tree} from '@jlguenego/tree';
import {NonTerminal} from '../NonTerminal';
export const convertInputTapeToTree = (
  cfg: ContextFreeGrammar,
  outputTape: OutputTape
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
  return tree;
};
