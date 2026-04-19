export const BLANK = '_';

export const createTape = (input) => {
  const normalized = input ?? '';
  return normalized.length > 0 ? normalized.split('') : [BLANK];
};

export const runLogic = (tape, head, state, rules) => {
  const nextTape = [...tape];

  while (head >= nextTape.length) {
    nextTape.push(BLANK);
  }

  const currentSymbol = nextTape[head] ?? BLANK;
  const rule = rules.find((candidate) => candidate.s === state && candidate.r === currentSymbol);

  if (!rule) {
    return null;
  }

  nextTape[head] = rule.w;

  let nextHead = rule.m === 'L' ? head - 1 : head + 1;

  if (nextHead < 0) {
    nextTape.unshift(BLANK);
    nextHead = 0;
  }

  if (nextHead >= nextTape.length) {
    nextTape.push(BLANK);
  }

  return {
    tape: nextTape,
    head: nextHead,
    state: rule.n,
    rule,
  };
};
