import {ContextFreeGrammar} from '../../ContextFreeGrammar';
import {NonTerminal} from '../../NonTerminal';
import {SententialForm} from '../../SententialForm';
import {firstStar} from '../../top-down/lib/first';
import {LR1Item} from './LR1Item';

export const computeLR1Closure = (
  cfg: ContextFreeGrammar,
  configSet: Set<LR1Item>
) => {
  let previousSize = -1;
  let size = configSet.size;
  while (size > previousSize) {
    for (const item of configSet) {
      const nextSymbol = item.getNextSymbol();
      if (!(nextSymbol instanceof NonTerminal)) {
        continue;
      }
      cfg.productions
        .filter(p => p.LHS === nextSymbol)
        .forEach(p => {
          const remaining = item.getAfterNextSymbol();
          remaining.push(item.lookAhead);
          for (const x of firstStar(cfg, new SententialForm(remaining))) {
            configSet.add(new LR1Item(p, 0, x));
          }
        });
    }

    previousSize = size;
    size = configSet.size;
  }
};
