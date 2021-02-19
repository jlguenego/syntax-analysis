import {PSpec} from '../interfaces/Production';
import {CFGSpec} from '../interfaces/CFGSpec';
import {NonTerminalAlphabet} from '../NonTerminalAlphabet';
import {TerminalAlphabet} from '../TerminalAlphabet';
import {Sets} from '@jlguenego/set';

export const checkAlphabetAreDisjoint = (
  t: TerminalAlphabet,
  nt: NonTerminalAlphabet
): void => {
  const keyT = Object.keys(t);
  const setNT = new Set(Object.keys(nt));
  const intersection = new Set(keyT.filter(x => setNT.has(x)));
  if (intersection.size > 0) {
    throw new Error(
      'Terminal alphabet and nonterminal Alphabet must be disjoint'
    );
  }
};

export const getUnReachableProductionRule = (spec: CFGSpec): PSpec[] => {
  const unreachableRules: PSpec[] = [];
  const s = spec.startSymbol;
  for (const p of spec.productions) {
    const nt = p.LHS as string;
    const ancestors = getAncestors(spec, nt);
    if (!ancestors.has(s)) {
      unreachableRules.push(p);
    }
  }
  return unreachableRules;
};

export const getParents = (spec: CFGSpec, nt: string): Set<string> => {
  const parentArray = spec.productions
    .filter(p => (p.RHS as string[]).includes(nt))
    .map(p => p.LHS as string);
  parentArray.push(nt);
  return new Set(parentArray);
};

export const getAncestors = (spec: CFGSpec, nt: string): Set<string> => {
  let previousSet = new Set<string>([]);
  let set = new Set([nt]);

  while (set.size > previousSet.size) {
    previousSet = set;
    set = new Set();
    for (const e of previousSet) {
      const s = getParents(spec, e);
      Sets.absorb(set, s);
    }
  }
  return set;
};

export const removeUnreachableProductionRules = (
  spec: CFGSpec,
  rules: PSpec[]
): CFGSpec => {
  return {
    nt: spec.nt,
    t: spec.t,
    startSymbol: spec.startSymbol,
    productions: spec.productions.filter(r => !rules.includes(r)),
  };
};
