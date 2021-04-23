import { allFields } from "./allFields";
import { drill } from './drill';
import { appendStack, createStack, popStack, pushStack, Stack } from './stack';
import { LevelIterator } from "./types";

function initializeStack(...values: Array<Record<string, any>>): Stack<LevelIterator> {
  const fields = allFields(...values);
  const stack = createStack<LevelIterator>();
  return pushStack(stack, {
    key: '',
    fields: fields,
    index: -1,
    values,
  });
}

export function* postOrder(...values: Array<Record<string, any>>) {
  let stack = initializeStack(...values);

  const [tip, _stack] = popStack(stack);
  stack = _stack;
  stack = appendStack(stack, ...drill(tip));

  do {
    const [tip, _stack] = popStack(stack);
    stack = _stack;

    const tail = drill(tip);
    if (!tail.length)
      yield [tip.key, ...tip.values];

    stack = appendStack(stack, ...tail);
  } while (stack.length);
}
