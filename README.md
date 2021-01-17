# Syntax Analysis

Syntax analysis (compiler step just after lexer).

## Install

```
npm i @jlguenego/syntax-analysis
```

## Usage

You should use Typescript in order to check your grammar in a easier way.

```ts
class TA extends TerminalAlphabet {
  PLUS: Terminal = {name: '+'};
  INT: Terminal = {name: 'int'};
}

class NTA extends NonTerminalAlphabet {
  S = new NonTerminal('S');
  E = new NonTerminal('E');
  F = new NonTerminal('F');
}

const nt = new NTA();
const t = new TA();

const spec: CFGSpec<TA, NTA> = {
  startSymbol: 'S',
  productions: [
    {LHS: 'S', RHS: ['E']},
    {LHS: 'E', RHS: ['E', 'PLUS', 'F']},
    {LHS: 'E', RHS: ['F']},
    {LHS: 'F', RHS: ['INT']},
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

- BFS1: Naive Breadth First Search with nothing else (very slow, may take many days...).
- BFS2: BFS1 with 2 checks for speeding BFS (slow, may take many hours...).
  - checks the length of sentential form
  - checks the sentence prefix of the sentential form
- BFS3: BFS2 with LeftMost Derivation strategy (not so slow, mak take some minutes...).

### Depth First Search

- DFS1: Leftmost derivation strategy. (not so slow execpt for left recursive grammar)
- DFS2: use one lookahead terminal to speed up a little bit.

- LL1: yes ! This is linear O(ng), n is the size of the string to parse, and g is the size of the grammar.
  - Warning: the grammar must be LL(1) compatible. So you may have to refactor your grammar in some case:
    - Left factoring
    - Convert left recursion to right recursion.

## Bottom up algorithm

### LR(0)

### LR(1)

## Project related

- [@jlguenego/lexer](https://github.com/jlguenego/lexer)
- [@jlguenego/tree](https://github.com/jlguenego/tree)

## Theory

- [Stanford CS143](https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/)

## Todo

- Add observable for illustration

## Author

Jean-Louis GUENEGO <jlguenego@gmail.com>
