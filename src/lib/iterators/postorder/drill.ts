import { produce } from "immer";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";

import { allFields } from "./allFields";
import { isPrimitive } from "./isPrimitive";
import { createStack, pushStack, Stack } from './stack';
import { LevelIterator } from "./types";

/**
 * Drills into an object given a LevelIterator. For the initial
 * iterator into the object the index must be set to -1, that way
 * the drill operation will initialize it automatically. For
 * subsequent operations the drill function will take care of
 * increasing the index if possible on the initial state.
 *
 * @param initial
 */
export function drill(initial?: LevelIterator): Stack<LevelIterator> {
  let result = createStack<LevelIterator>();
  const { index, fields } = initial ?? {};
  if (!fields?.[index + 1]) return result;

  const updatedInitial = produce(initial, draft => { draft.index++; });
  result = pushStack(result, updatedInitial);

  let currentLevel = updatedInitial;
  do {
    if (isEmpty(currentLevel.fields))
      break;

    const nextField = currentLevel.fields[currentLevel.index];
    const nextValues = currentLevel.values.map(value =>
      isNil(value) || isPrimitive(value)
        ? undefined
        : value[nextField]
    );
    const nextFields = allFields(...nextValues);
    const nextLevel = {
      key: `${currentLevel.key ? currentLevel.key + '.' : ''}${nextField}`,
      fields: nextFields,
      index: 0,
      values: nextValues,
    };

    result = pushStack(result, nextLevel);
    currentLevel = nextLevel;
  } while (currentLevel);

  return result;
}
