import {Group, Lexer, Rule, TokenSequence} from '@jlguenego/lexer';
import {
  CFGSpecifications,
  ContextFreeGrammar,
  Sentence,
  ParseTree,
  defineNonTerminalAlphabet,
  defineTerminalAlphabet,
} from '../../../src';

const blank = new Rule({
  name: 'blank',
  pattern: /[ \r\n\t]+/,
  ignore: true,
});

const operators = Rule.createGroup(Group.OPERATORS, [
  {
    name: '~',
    pattern: /~/,
  },
  {
    name: '=>',
    pattern: /=>/,
  },
]);
const separators = Rule.createGroup(Group.SEPARATORS, [
  {
    name: '(',
    pattern: /\(/,
  },
  {
    name: ')',
    pattern: /\)/,
  },
]);

const letterRule = new Rule({
  name: 'letter',
  pattern: /\w+/,
  group: Group.IDENTIFIERS,
});

const rules = [blank, ...separators, ...operators, letterRule];

export function lexer03(str: string): TokenSequence {
  const tokenSequence = new Lexer(rules).tokenize(str);
  return tokenSequence;
}

const t = defineTerminalAlphabet(['letter', '(', ')', '=>', '~'] as const);
const nt = defineNonTerminalAlphabet([
  'WelformedStatement',
  'PrimitiveSymbol',
  'Implication',
  'Negation',
] as const);

const spec: CFGSpecifications<typeof nt, typeof t> = {
  nt,
  t,
  productions: [
    {LHS: 'WelformedStatement', RHS: ['Implication']},
    {LHS: 'WelformedStatement', RHS: ['Negation']},
    {LHS: 'WelformedStatement', RHS: ['letter']},
    {
      LHS: 'Implication',
      RHS: ['(', 'WelformedStatement', '=>', 'WelformedStatement', ')'],
    },
    {LHS: 'Negation', RHS: ['(', '~', 'WelformedStatement', ')']},
  ],
  startSymbol: 'WelformedStatement',
};
export const cfg03 = new ContextFreeGrammar(spec);

export const expectedLLkTableString03 = `T0 LLKTable WelformedStatement { ε }
((: 0 | Implication:{ ε }
(letter: 0 | Implication:{ ε }
(~: 1 | Negation:{ ε }
letter: 2 | <empty>

T1 LLKTable Implication { ε }
((: 3 | WelformedStatement:{ =>(,=>letter }WelformedStatement:{ ) }
(letter: 3 | WelformedStatement:{ =>(,=>letter }WelformedStatement:{ ) }

T2 LLKTable Negation { ε }
(~: 4 | WelformedStatement:{ ) }

T3 LLKTable WelformedStatement { =>(,=>letter }
((: 0 | Implication:{ =>(,=>letter }
(letter: 0 | Implication:{ =>(,=>letter }
(~: 1 | Negation:{ =>(,=>letter }
letter=>: 2 | <empty>

T4 LLKTable WelformedStatement { ) }
((: 0 | Implication:{ ) }
(letter: 0 | Implication:{ ) }
(~: 1 | Negation:{ ) }
letter): 2 | <empty>

T5 LLKTable Implication { =>(,=>letter }
((: 3 | WelformedStatement:{ =>(,=>letter }WelformedStatement:{ )=> }
(letter: 3 | WelformedStatement:{ =>(,=>letter }WelformedStatement:{ )=> }

T6 LLKTable Negation { =>(,=>letter }
(~: 4 | WelformedStatement:{ )=> }

T7 LLKTable Implication { ) }
((: 3 | WelformedStatement:{ =>(,=>letter }WelformedStatement:{ )) }
(letter: 3 | WelformedStatement:{ =>(,=>letter }WelformedStatement:{ )) }

T8 LLKTable Negation { ) }
(~: 4 | WelformedStatement:{ )) }

T9 LLKTable WelformedStatement { )=> }
((: 0 | Implication:{ )=> }
(letter: 0 | Implication:{ )=> }
(~: 1 | Negation:{ )=> }
letter): 2 | <empty>

T10 LLKTable WelformedStatement { )) }
((: 0 | Implication:{ )) }
(letter: 0 | Implication:{ )) }
(~: 1 | Negation:{ )) }
letter): 2 | <empty>

T11 LLKTable Implication { )=> }
((: 3 | WelformedStatement:{ =>(,=>letter }WelformedStatement:{ )) }
(letter: 3 | WelformedStatement:{ =>(,=>letter }WelformedStatement:{ )) }

T12 LLKTable Negation { )=> }
(~: 4 | WelformedStatement:{ )) }

T13 LLKTable Implication { )) }
((: 3 | WelformedStatement:{ =>(,=>letter }WelformedStatement:{ )) }
(letter: 3 | WelformedStatement:{ =>(,=>letter }WelformedStatement:{ )) }

T14 LLKTable Negation { )) }
(~: 4 | WelformedStatement:{ )) }

`;

export const expectedLLkParseTableString03 = `f(T0,<((>)=0, T1
f(T0,<(letter>)=0, T1
f(T0,<(~>)=1, T2
f(T0,<letter>)=2, letter
f(T1,<((>)=3, (T3=>T4)
f(T1,<(letter>)=3, (T3=>T4)
f(T2,<(~>)=4, (~T4)
f(T3,<((>)=0, T5
f(T3,<(letter>)=0, T5
f(T3,<(~>)=1, T6
f(T3,<letter=>>)=2, letter
f(T4,<((>)=0, T7
f(T4,<(letter>)=0, T7
f(T4,<(~>)=1, T8
f(T4,<letter)>)=2, letter
f(T5,<((>)=3, (T3=>T9)
f(T5,<(letter>)=3, (T3=>T9)
f(T6,<(~>)=4, (~T9)
f(T7,<((>)=3, (T3=>T10)
f(T7,<(letter>)=3, (T3=>T10)
f(T8,<(~>)=4, (~T10)
f(T9,<((>)=0, T11
f(T9,<(letter>)=0, T11
f(T9,<(~>)=1, T12
f(T9,<letter)>)=2, letter
f(T10,<((>)=0, T13
f(T10,<(letter>)=0, T13
f(T10,<(~>)=1, T14
f(T10,<letter)>)=2, letter
f(T11,<((>)=3, (T3=>T10)
f(T11,<(letter>)=3, (T3=>T10)
f(T12,<(~>)=4, (~T10)
f(T13,<((>)=3, (T3=>T10)
f(T13,<(letter>)=3, (T3=>T10)
f(T14,<(~>)=4, (~T10)
`;

export const sentence03: Sentence = lexer03('( a => ( b => a ) )') as Sentence;
export const expectedParseTree03: ParseTree = {
  node: nt.WelformedStatement,
  children: [
    {
      node: nt.Implication,
      children: [
        {
          node: {
            name: '(',
            lexeme: '(',
            group: 'separators',
            position: {line: 1, col: 1},
            attribute: '(',
          },
        },
        {
          node: nt.WelformedStatement,
          children: [
            {
              node: {
                name: 'letter',
                lexeme: 'a',
                group: 'identifiers',
                position: {line: 1, col: 3},
                attribute: 'a',
              },
            },
          ],
        },
        {
          node: {
            name: '=>',
            lexeme: '=>',
            group: 'operators',
            position: {line: 1, col: 5},
            attribute: '=>',
          },
        },
        {
          node: nt.WelformedStatement,
          children: [
            {
              node: nt.Implication,
              children: [
                {
                  node: {
                    name: '(',
                    lexeme: '(',
                    group: 'separators',
                    position: {line: 1, col: 8},
                    attribute: '(',
                  },
                },
                {
                  node: nt.WelformedStatement,
                  children: [
                    {
                      node: {
                        name: 'letter',
                        lexeme: 'b',
                        group: 'identifiers',
                        position: {line: 1, col: 10},
                        attribute: 'b',
                      },
                    },
                  ],
                },
                {
                  node: {
                    name: '=>',
                    lexeme: '=>',
                    group: 'operators',
                    position: {line: 1, col: 12},
                    attribute: '=>',
                  },
                },
                {
                  node: nt.WelformedStatement,
                  children: [
                    {
                      node: {
                        name: 'letter',
                        lexeme: 'a',
                        group: 'identifiers',
                        position: {line: 1, col: 15},
                        attribute: 'a',
                      },
                    },
                  ],
                },
                {
                  node: {
                    name: ')',
                    lexeme: ')',
                    group: 'separators',
                    position: {line: 1, col: 17},
                    attribute: ')',
                  },
                },
              ],
            },
          ],
        },
        {
          node: {
            name: ')',
            lexeme: ')',
            group: 'separators',
            position: {line: 1, col: 19},
            attribute: ')',
          },
        },
      ],
    },
  ],
} as ParseTree;
