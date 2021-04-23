import isArray from 'lodash/isArray';
import isBuffer from 'lodash/isBuffer';
import isFunction from 'lodash/isFunction';
import isMap from 'lodash/isMap';
import isSet from 'lodash/isSet';
import isWeakMap from 'lodash/isWeakMap';

/**
 * We define a drillable object based on what the value **isn't**
 * being **not drillable** if the value is either:
 * - Array
 * - Buffer
 * - Function
 * - Set
 * - Map
 * - WeakMap
 *
 * Any other value is considered drillable. This may usually be a
 * plain JS object but could also be a class instance defined by
 * the user.
 *
 * @param value - The value to examine as drillable.
 */
export function isDrillable<T>(value: T): boolean {
  return [
    isArray,
    isBuffer,
    isFunction,
    isSet,
    isMap,
    isWeakMap,
  ].every(fn => !fn(value));
}
