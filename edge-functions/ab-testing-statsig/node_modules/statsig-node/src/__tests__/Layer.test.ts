import Layer from '../Layer';

describe('Verify behavior of Layer', () => {
  const testLayer = new Layer(
    'test_layer',
    {
      bool: true,
      number: 2,
      string: 'string',
      object: {
        key: 'value',
        key2: 123,
      },
      boolStr1: 'true',
      boolStr2: 'FALSE',
      numberStr1: '3',
      numberStr2: '3.3',
      numberStr3: '3.3.3',
      arr: [1, 2, 'three'],
    },
    'default',
  );

  beforeEach(() => {
    expect.hasAssertions();
  });

  test('Test constructor', () => {
    // @ts-ignore intentional mistyping test
    const layer = new Layer('name', 123);
    // @ts-ignore intentional mistyping test
    expect(layer.get()).toStrictEqual(null);
  });

  test('Test getValue key not found', () => {
    expect(testLayer.getValue('key_not_found')).toBeNull();
    expect(testLayer.getValue('key_not_found', null)).toBeNull();
    expect(testLayer.getValue('key_not_found', true)).toStrictEqual(true);
    expect(testLayer.getValue('key_not_found', 12)).toStrictEqual(12);
    expect(testLayer.getValue('key_not_found', '123')).toStrictEqual('123');
    expect(testLayer.getValue('key_not_found', ['1', '2'])).toStrictEqual([
      '1',
      '2',
    ]);
    expect(testLayer.getValue('key_not_found', { test: 123 })).toStrictEqual({
      test: 123,
    });
    expect(testLayer.getRuleID()).toStrictEqual('default');
  });

  test('Test get key not found', () => {
    // @ts-ignore intentional mistyping test
    expect(testLayer.get('key_not_found')).toBeNull();
    expect(testLayer.get('key_not_found', null)).toBeNull();
    expect(testLayer.get('key_not_found', true)).toStrictEqual(true);
    expect(testLayer.get('key_not_found', 12)).toStrictEqual(12);
    expect(testLayer.get('key_not_found', '123')).toStrictEqual('123');
    expect(testLayer.get('key_not_found', ['1', '2'])).toStrictEqual([
      '1',
      '2',
    ]);
    expect(testLayer.get('key_not_found', { test: 123 })).toStrictEqual({
      test: 123,
    });
  });

  test('Test all types types', () => {
    expect(testLayer.getValue('boolStr1', '123')).toStrictEqual('true');
    expect(testLayer.getValue('boolStr1', null)).toStrictEqual('true');
    expect(testLayer.getValue('boolStr1')).toStrictEqual('true');

    expect(testLayer.getValue('number', '123')).toStrictEqual(2);
    expect(testLayer.getValue('number', null)).toStrictEqual(2);
    expect(testLayer.getValue('number')).toStrictEqual(2);

    expect(testLayer.getValue('bool', '123')).toStrictEqual(true);
    expect(testLayer.getValue('bool', null)).toStrictEqual(true);
    expect(testLayer.getValue('bool')).toStrictEqual(true);

    expect(testLayer.getValue('object', '123')).toStrictEqual({
      key: 'value',
      key2: 123,
    });
    expect(testLayer.getValue('object', null)).toStrictEqual({
      key: 'value',
      key2: 123,
    });
    expect(testLayer.getValue('object')).toStrictEqual({
      key: 'value',
      key2: 123,
    });

    expect(testLayer.getValue('arr', '123')).toStrictEqual([1, 2, 'three']);
    expect(testLayer.getValue('arr', null)).toStrictEqual([1, 2, 'three']);
    expect(testLayer.getValue('arr')).toStrictEqual([1, 2, 'three']);
  });

  test('Test typed getting with matching types', () => {
    expect(testLayer.get('boolStr1', '123')).toStrictEqual('true');
    expect(testLayer.get('boolStr1', null)).toStrictEqual('true');
    // @ts-ignore intentional mistyping test
    expect(testLayer.get('boolStr1')).toStrictEqual('true');

    expect(testLayer.get('number', 123)).toStrictEqual(2);
    expect(testLayer.get('number', null)).toStrictEqual(2);
    // @ts-ignore intentional mistyping test
    expect(testLayer.get('number')).toStrictEqual(2);

    expect(testLayer.get('bool', false)).toStrictEqual(true);
    expect(testLayer.get('bool', null)).toStrictEqual(true);
    // @ts-ignore intentional mistyping test
    expect(testLayer.get('bool')).toStrictEqual(true);

    expect(testLayer.get('object', {})).toStrictEqual({
      key: 'value',
      key2: 123,
    });
    expect(testLayer.get('object', null)).toStrictEqual({
      key: 'value',
      key2: 123,
    });
    // @ts-ignore intentional mistyping test
    expect(testLayer.get('object')).toStrictEqual({
      key: 'value',
      key2: 123,
    });

    expect(testLayer.get('arr', [])).toStrictEqual([1, 2, 'three']);
    expect(testLayer.get('arr', null)).toStrictEqual([1, 2, 'three']);
    // @ts-ignore intentional mistyping test
    expect(testLayer.get('arr')).toStrictEqual([1, 2, 'three']);
  });

  test('Test typed getter mismatches', () => {
    expect(testLayer.get('boolStr1', 123)).toStrictEqual(123);
    expect(testLayer.get('number', '123')).toStrictEqual('123');
    expect(testLayer.get('bool', '123')).toStrictEqual('123');
    expect(testLayer.get('object', '123')).toStrictEqual('123');
    expect(testLayer.get('object', ['123'])).toStrictEqual(['123']);
    expect(testLayer.get('arr', {})).toStrictEqual({});
  });

  test('Behavior of dummy layers', () => {
    const dummyLayer = new Layer('layerName');
    // @ts-ignore intentional mistyping test
    expect(dummyLayer.get()).toBeNull();
    // @ts-ignore intentional mistyping test
    expect(dummyLayer.get('test_field')).toBeNull();
    expect(dummyLayer.get('str', 'default_value')).toEqual('default_value');
    expect(dummyLayer.get('bool', true)).toEqual(true);
    expect(dummyLayer.get('number', 1.234)).toEqual(1.234);
    expect(dummyLayer.get('arr', [1, 2, 3])).toEqual([1, 2, 3]);
    expect(dummyLayer.get('obj', { key: 'value' })).toEqual({ key: 'value' });

    // @ts-ignore intentional mistyping test
    expect(dummyLayer.getValue()).toEqual(null);
    expect(dummyLayer.getValue('test_field')).toEqual(null);
    expect(dummyLayer.getValue('str', 'default_value')).toEqual(
      'default_value',
    );
    expect(dummyLayer.getValue('bool', true)).toEqual(true);
    expect(dummyLayer.getValue('number', 1.234)).toEqual(1.234);
    expect(dummyLayer.getValue('arr', [1, 2, 3])).toEqual([1, 2, 3]);
    expect(dummyLayer.getValue('obj', { key: 'value' })).toEqual({
      key: 'value',
    });
  });
});
