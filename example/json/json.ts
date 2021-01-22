import {Group, Lexer, Rule} from '@jlguenego/lexer';
import {inspect} from 'util';
import {
  CFGSpec,
  CFGSpecifications,
  ContextFreeGrammar,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
  parse,
} from '../../src/index';

const str = `
{
    "toto0": ["titi", "tete", 123.234],
    "toto1": ["titi", "tete", 123.234],
    "toto2": ["titi", "tete", 123.234],
    "toto3": ["titi", "tete", 123.234]
}
`;

const stringRule = new Rule({
  name: 'string',
  pattern: /"(.*?)"/,
  group: Group.IDENTIFIERS,
  preprocess: true,
  generateTokenAttribute: (lexeme: string) => {
    return lexeme.substr(1, lexeme.length - 2);
  },
});

const blank = new Rule({
  name: 'blank',
  pattern: /\s+/,
  ignore: true,
});
const operators = Rule.createGroup(Group.OPERATORS, [
  {
    name: ':',
    pattern: /:/,
  },
]);
const separators = Rule.createGroup(Group.SEPARATORS, [
  {
    name: '{',
    pattern: /\{/,
  },
  {
    name: '}',
    pattern: /\}/,
  },
  {
    name: '[',
    pattern: /\[/,
  },
  {
    name: ']',
    pattern: /\]/,
  },
  {
    name: ',',
    pattern: /,/,
  },
]);

const numberRule = new Rule({
  name: 'number',
  pattern: /[-]{0,1}[\d]*[.]{0,1}[\d]+/,
  group: Group.IDENTIFIERS,
  generateTokenAttribute: (lexeme: string) => +lexeme,
});

const rules = [stringRule, blank, ...separators, ...operators, numberRule];
const tokenSequence = new Lexer(rules).tokenize(str);
console.log('tokenSequence: ', tokenSequence);

const t = defineTerminalAlphabet([
  '{',
  '}',
  '[',
  ']',
  ':',
  ',',
  'number',
  'string',
]);
const nt = defineNonTerminalAlphabet([
  'Json',
  'Elements',
  'Element',
  'Object',
  'Array',
  'Value',
  'Members',
  'Member',
] as const);

const spec: CFGSpecifications<typeof t, typeof nt> = {
  startSymbol: 'Json',
  productions: [
    {LHS: 'Json', RHS: ['Element']},
    {LHS: 'Element', RHS: ['Value']},
    {LHS: 'Value', RHS: ['Object']},
    {LHS: 'Value', RHS: ['Array']},
    {LHS: 'Value', RHS: ['string']},
    {LHS: 'Value', RHS: ['number']},
    {LHS: 'Object', RHS: ['{', '}']},
    {LHS: 'Object', RHS: ['{', 'Members', '}']},
    {LHS: 'Members', RHS: ['Member']},
    {LHS: 'Members', RHS: ['Members', ',', 'Member']},
    {LHS: 'Member', RHS: ['string', ':', 'Element']},
    {LHS: 'Array', RHS: ['[', 'Elements', ']']},
    {LHS: 'Elements', RHS: ['Element']},
    {LHS: 'Elements', RHS: ['Elements', ',', 'Element']},
  ],
};
export const cfg = new ContextFreeGrammar(spec as CFGSpec, t, nt);

const parseTree = parse(tokenSequence, cfg, {method: 'SLR1'});
console.log('parseTree: ', inspect(parseTree, false, null, true));
