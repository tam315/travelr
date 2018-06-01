const { getQueryColumns, getQueryValues } = require('../db');

describe('getQueryColumns', () => {
  it('works with array', () => {
    const sampleArray = [
      {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
      },
      {
        key5: 'value5',
        key6: 'value6',
        key7: 'value7',
        key8: 'value8',
      },
    ];

    expect(getQueryColumns(sampleArray)).toBe('key1,key2,key3,key4');
  });

  it('works with single object', () => {
    const sampleObject = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
    };

    expect(getQueryColumns(sampleObject)).toBe('key1,key2,key3,key4');
  });
});

describe('getQueryValues', () => {
  it('works with array', () => {
    const sampleArray = [
      {
        key1: 'value1',
        key2: 'value2',
      },
      {
        key1: 'value3',
        key2: 'value4',
      },
      {
        key1: 'value5',
        key2: 'value6',
        key3: 'value7',
      },
      {
        key1: 'value8',
        key2: 'value9',
        key3: 'value10',
        key4: 'value11',
      },
    ];

    expect(getQueryValues(sampleArray)).toEqual([
      ['value1', 'value2'],
      ['value3', 'value4'],
      ['value5', 'value6'],
      ['value8', 'value9'],
    ]);
  });
});
