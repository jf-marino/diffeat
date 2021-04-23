import { allFields } from './allFields';

test('allFields should return all first depth fields in an object', () => {
  expect(allFields(
    { foo: 'foo', bar: 'bar', baz: { hello: 'world' } }
  )).toEqual(['bar', 'baz', 'foo']);
});

test('allFields should return the union of fields in all provided objects', () => {
  expect(allFields(
    { foo: 'foo', bar: 'bar', baz: { hello: 'world' } },
    { foo: 'foo', bar: 'bar', greeting: [], other: 'otherValue' },
    { id: '1' }
  )).toEqual(['bar', 'baz', 'foo', 'greeting', 'id', 'other']);
});

test('allFields should return the list of fields in alphabetical order', () => {
  expect(allFields(
    { a: 'a', '$': '$' },
    { b: 'b', '123': '123' },
    { '_': '_', q: 'q', z: 'z' },
  )).toEqual(['$', '123', '_', 'a', 'b', 'q', 'z']);
});

