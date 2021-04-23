import { produce } from 'immer';
import last from 'lodash/last';

export type Stack<T> = Array<T>;

export function createStack<T>(): Stack<T> {
  return [] as Stack<T>;
}

export function popStack<T>(stack: Stack<T>): [T, Stack<T>] {
  const popped = last(stack);
  const updated = produce(stack, draft => {
    draft.pop();
  });
  return [popped, updated];
}

export function pushStack<T>(stack: Stack<T>, value: T): Stack<T> {
  return appendStack(stack, value);
}

export function appendStack<T>(stack: Stack<T>, ...values: Array<T>): Stack<T> {
  return produce<Stack<T>>(stack, draft => {
    // For some reason immer won't let me push
    // a value on to Draft<T> for some reason. It
    // doesn't seem to understand the type even if
    // I narrow the type of `draft` in the argument list.
    (draft as Stack<T>).push(...values);
  });
}
