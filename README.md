# Syntax Analysis

Syntax analysis (compiler step just after lexer).

## Install

```
npm i @jlguenego/syntax-analysis
```

## Usage

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
const parseTree = parse<NTA, TA>(sentence, cfg, {algo: 'BFS1');
```

## Top down algorithm

### Breadth First Search

- BFS1: Naive Breadth First Search with nothing else (very slow, but didactic).

### Depth First Search

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
