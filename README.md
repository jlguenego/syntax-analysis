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
  '+': Terminal = {name: '+'};
  'int': Terminal = {name: 'int'};
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

## Bottom up algorithm

- **LR(0)**: Use an LR0 automaton, and decide to shift or reduce without lookahead.
- **LR(1)**: Use an LR1 automaton, and decide to shift or reduce with one lookahead.
- **SLR(1)**: Use the LR0 automaton augmented with the FOLLOW terminals, and decide to shift or reduce with one lookahead.
- **LALR(1)**: Use the LALR1 automaton (constructed with the "Lazy Merging" technique), and decide to shift or reduce with one lookahead.

## Project related

- [@jlguenego/lexer](https://github.com/jlguenego/lexer)
- [@jlguenego/tree](https://github.com/jlguenego/tree)

## Theory

- [Stanford CS143](https://web.stanford.edu/class/archive/cs/cs143/cs143.1128/)

## Todo

- Add observable for illustration

## Author

Jean-Louis GUENEGO <jlguenego@gmail.com>
