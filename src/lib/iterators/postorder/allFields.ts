import { produce } from "immer";
import isNil from 'lodash/isNil';

import { isPrimitive } from "./isPrimitive";

export function allFields(...values: Array<any>): Array<string> {
  const fields = values
    .map(v => isNil(v) || isPrimitive(v) ? [] : Object.keys(v))
    .reduce((all, fields: Array<string>): Array<string> => {
      return produce(all, draft => {
        fields.forEach(field => draft.push(field));
      });
    }, []);

  return Array.from(new Set(fields).values()).sort();
}
