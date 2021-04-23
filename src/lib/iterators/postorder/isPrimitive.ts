import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";

export function isPrimitive<T>(value: T): boolean {
  return [isBoolean, isNumber, isString].some(fn => fn(value));
}
