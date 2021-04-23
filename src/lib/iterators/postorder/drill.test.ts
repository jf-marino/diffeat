import { allFields } from './allFields';
import { drill } from './drill';

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

test('drill should go in depth on an object', () => {
  const example = createExample();
  const fields = Object.keys(example);
  const initial = {
    key: '',
    fields,
    index: -1,
    values: [example],
  };

  const result = drill(initial);
  expect(result).toEqual([
    {
      key: '',
      fields: ['foo', 'greeting'],
      index: 0,
      values: [example],
    },
    {
      key: 'foo',
      fields: [],
      index: 0,
      values: ['foobar1'],
    },
  ]);
});

test('drill should go in depth on an object that has already been iterated on', () => {
  const example = createExample();
  const fields = Object.keys(example);
  const initial = {
    key: '',
    fields,
    index: 0,
    values: [example],
  };

  const result = drill(initial);
  expect(result).toEqual([
    {
      key: '',
      fields: ['foo', 'greeting'],
      index: 1,
      values: [example],
    },
    {
      key: 'greeting',
      fields: ['bar', 'baz'],
      index: 0,
      values: [example.greeting],
    },
    {
      key: 'greeting.bar',
      fields: [],
      index: 0,
      values: [example.greeting.bar],
    },
  ]);
});

test('drill should iterate over multiple objects simultaneously', () => {
  const exampleOne = createExample('1');
  const exampleTwo = createExample('2');
  const exampleThree = createExample('3');

  const fields = allFields(exampleOne, exampleTwo, exampleThree);
  const initial = {
    key: '',
    fields,
    index: 0,
    values: [exampleOne, exampleTwo, exampleThree],
  };

  const result = drill(initial);
  expect(result).toEqual([
    {
      key: '',
      fields: ['foo', 'greeting'],
      index: 1,
      values: [
        exampleOne,
        exampleTwo,
        exampleThree
      ],
    },
    {
      key: 'greeting',
      fields: ['bar', 'baz'],
      index: 0,
      values: [
        exampleOne.greeting,
        exampleTwo.greeting,
        exampleThree.greeting
      ],
    },
    {
      key: 'greeting.bar',
      fields: [],
      index: 0,
      values: [
        exampleOne.greeting.bar,
        exampleTwo.greeting.bar,
        exampleThree.greeting.bar
      ],
    },
  ]);
});

test('drill should iterate over all object fields simultaneously, not just the intersection of fields', () => {
  const exampleOne = {
    foo: '1',
    greeting: {
      customOne: 'customOneValue'
    }
  };

  const exampleTwo = {
    foo: '1',
    greeting: {
      customTwo: 'customTwoValue'
    }
  };

  const exampleThree = {
    foo: '1',
    greeting: {
      customThree: 'customThreeValue'
    }
  };

  const fields = allFields(exampleOne, exampleTwo, exampleThree);
  const initial = {
    key: '',
    fields,
    index: 0,
    values: [exampleOne, exampleTwo, exampleThree],
  };

  const result = drill(initial);
  expect(result).toEqual([
    {
      key: '',
      fields: ['foo', 'greeting'],
      index: 1,
      values: [
        exampleOne,
        exampleTwo,
        exampleThree
      ],
    },
    {
      key: 'greeting',
      fields: ['customOne', 'customThree', 'customTwo'],
      index: 0,
      values: [
        exampleOne.greeting,
        exampleTwo.greeting,
        exampleThree.greeting
      ],
    },
    {
      key: 'greeting.customOne',
      fields: [],
      index: 0,
      values: [
        exampleOne.greeting.customOne,
        undefined,
        undefined,
      ],
    },
  ]);
});
