import clone from 'lodash/cloneDeep';

import { postOrder } from './postorder';

function collectEntries(...records: Array<Record<string, any>>): Array<Array<any>> {
  const result = [] as Array<Array<any>>;
  for (const entry of postOrder(...records)) {
    result.push(entry);
  }
  return result;
}

function createExample(n = '1'): Record<string, any> {
  return {
    foo: `foobar${n}`,
    greeting: {
      bar: `bar${n}`,
      baz: {
        hello: `world${n}`
      }
    }
  };
}

test('postOrder should iterate over a single record', () => {
  const entries = collectEntries(createExample());
  expect(entries).toEqual([
    ['foo', 'foobar1'],
    ['greeting.bar', 'bar1'],
    ['greeting.baz.hello', 'world1'],
    ['greeting.baz', { hello: 'world1' }],
    ['greeting', { bar: 'bar1', baz: { hello: 'world1' } }],
    ['', { foo: 'foobar1', greeting: { bar: 'bar1', baz: { hello: 'world1' } } }]
  ]);
});

test('postOrder should iterate over multiple records', () => {
  const exampleOne = createExample('1');
  const exampleTwo = createExample('2');
  const exampleThree = createExample('3');
  const entries = collectEntries(
    exampleOne,
    exampleTwo,
    exampleThree,
  );

  expect(entries).toEqual([
    ['foo', 'foobar1', 'foobar2', 'foobar3'],
    ['greeting.bar', 'bar1', 'bar2', 'bar3'],
    ['greeting.baz.hello', 'world1', 'world2', 'world3'],
    ['greeting.baz', clone(exampleOne.greeting.baz), clone(exampleTwo.greeting.baz), clone(exampleThree.greeting.baz)],
    ['greeting', clone(exampleOne.greeting), clone(exampleTwo.greeting), clone(exampleThree.greeting)],
    ['', clone(exampleOne), clone(exampleTwo), clone(exampleThree)]
  ]);
});

test('postOrder should always iterate over all keys regardless of all records having them', () => {
  const exampleOne = createExample('1');
  const exampleTwo = createExample('2');
  const exampleThree = createExample('3');

  exampleOne.customOne = 'customValueOne';
  exampleTwo.greeting.customTwo = 'customValueTwo';
  exampleThree.greeting.baz.customThree = 'customValueThree';

  const entries = collectEntries(
    exampleOne,
    exampleTwo,
    exampleThree,
  );

  expect(entries).toEqual([
    ['customOne', 'customValueOne', undefined, undefined],
    ['foo', 'foobar1', 'foobar2', 'foobar3'],
    ['greeting.bar', 'bar1', 'bar2', 'bar3'],
    ['greeting.baz.customThree', undefined, undefined, 'customValueThree'],
    ['greeting.baz.hello', 'world1', 'world2', 'world3'],
    ['greeting.baz', clone(exampleOne.greeting.baz), clone(exampleTwo.greeting.baz), clone(exampleThree.greeting.baz)],
    ['greeting.customTwo', undefined, 'customValueTwo', undefined],
    ['greeting', clone(exampleOne.greeting), clone(exampleTwo.greeting), clone(exampleThree.greeting)],
    ['', clone(exampleOne), clone(exampleTwo), clone(exampleThree)]
  ]);
});
