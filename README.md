# Syntax Analysis

Syntax analysis (compiler step just after lexer).

## Install

```
npm i @jlguenego/syntax-analysis
```

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

## Usage

You should use Typescript in order to check your grammar in a easier way.

```ts
const t = defineTerminalAlphabet(['+', 'int'] as const);
const nt = defineNonTerminalAlphabet(['S', 'E', 'F'] as const);

type TA = typeof t;
type NTA = typeof nt;

const spec: CFGSpec<TA, NTA> = {
  startSymbol: 'S',
  productions: [
    {LHS: 'S', RHS: ['E']},
    {LHS: 'E', RHS: ['E', '+', 'F']},
    {LHS: 'E', RHS: ['F']},
    {LHS: 'F', RHS: ['int']},
  ],
};
const cfg = new ContextFreeGrammar(spec, t, nt);

// coming from a lexer (ex: @jlguenego/lexer)
const sentence = [{name: 'int'}, {name: '+'}, {name: 'int'}];

// the real job
const parseTree = parse<NTA, TA>(sentence, cfg, {method: 'LL1');
```

## Top down algorithm

### Breadth First Search

- **BFS1**: Naive Breadth First Search with nothing else (very slow, may take many days...).
- **BFS2**: Like BFS1 with 2 checks for speeding BFS (slow, may take many hours...).
  - checks the length of sentential form
  - checks the sentence prefix of the sentential form
- **BFS3**: Like BFS2 with LeftMost Derivation strategy (not so slow, mak take some minutes...).

### Depth First Search

- **DFS1**: Leftmost derivation strategy. (not so slow execpt for left recursive grammar)
- **DFS2**: Like DFS1 but use one lookahead terminal to speed up a little bit.

- **LL1**: Like DFS2 but use a LL1 table to know exactly wich production rule to use for the next sentential form.
  This one is linear O(ng), n is the size of the string to parse, and g is the size of the grammar.

  - Warning: the grammar must be LL(1) compatible. So you may have to refactor your grammar in some case:
    - Convert left recursion to right recursion.
    - Left factoring

- **LLk**: This one do not use anymore DFS but a k predictive algorithm, exactly as described in the Aho Ullman book (see [Theory](#theory)). It really parse real LLk grammar (ie not only the strong LLk grammar), k can be any integer ≥ 1.

## Bottom up algorithm

- **LR0**: Use an LR0 automaton, and decide to shift or reduce without lookahead.
- **LR1**: Use an LR1 automaton, and decide to shift or reduce with one lookahead.
- **SLR1**: Use the LR0 automaton augmented with the FOLLOW terminals, and decide to shift or reduce with one lookahead.
- **LALR1**: Use the LALR1 automaton (constructed with the "Lazy Merging" technique), and decide to shift or reduce with one lookahead.

Note about grammar: LR0 < SLR1 < LALR1 < LR1.

## Project related

- [@jlguenego/lexer](https://github.com/jlguenego/lexer)
- [@jlguenego/tree](https://github.com/jlguenego/tree)

## Theory

- [Stanford CS143](https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/)
- [Theory of Parsing, Translation and Compiling: Compiling vol. 1 - Aho Ullman](https://dl.acm.org/doi/pdf/10.5555/578789)

## Todo

- Add observable for illustration

## Author

Jean-Louis GUENEGO <jlguenego@gmail.com>
