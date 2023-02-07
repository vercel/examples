import DynamicConfig from '../DynamicConfig';

describe('Verify behavior of DynamicConfig', () => {
  const testConfig = new DynamicConfig(
    'test_config',
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
    let config = new DynamicConfig();
    // @ts-ignore intentional mistyping test
    expect(config.getValue()).toStrictEqual({});

    // @ts-ignore intentional mistyping test
    config = new DynamicConfig('name', 123);
    // @ts-ignore intentional mistyping test
    expect(config.get()).toStrictEqual({});
  });

  test('Test getValue key not found', () => {
    expect(testConfig.getValue('key_not_found')).toBeNull();
    expect(testConfig.getValue('key_not_found', null)).toBeNull();
    expect(testConfig.getValue('key_not_found', true)).toStrictEqual(true);
    expect(testConfig.getValue('key_not_found', 12)).toStrictEqual(12);
    expect(testConfig.getValue('key_not_found', '123')).toStrictEqual('123');
    expect(testConfig.getValue('key_not_found', ['1', '2'])).toStrictEqual([
      '1',
      '2',
    ]);
    expect(testConfig.getValue('key_not_found', { test: 123 })).toStrictEqual({
      test: 123,
    });
    expect(testConfig.getRuleID()).toStrictEqual('default');
  });

  test('Test get key not found', () => {
    // @ts-ignore intentional mistyping test
    expect(testConfig.get('key_not_found')).toBeNull();
    expect(testConfig.get('key_not_found', null)).toBeNull();
    expect(testConfig.get('key_not_found', true)).toStrictEqual(true);
    expect(testConfig.get('key_not_found', 12)).toStrictEqual(12);
    expect(testConfig.get('key_not_found', '123')).toStrictEqual('123');
    expect(testConfig.get('key_not_found', ['1', '2'])).toStrictEqual([
      '1',
      '2',
    ]);
    expect(testConfig.get('key_not_found', { test: 123 })).toStrictEqual({
      test: 123,
    });
  });

  test('Test all types types', () => {
    expect(testConfig.getValue('boolStr1', '123')).toStrictEqual('true');
    expect(testConfig.getValue('boolStr1', null)).toStrictEqual('true');
    expect(testConfig.getValue('boolStr1')).toStrictEqual('true');

    expect(testConfig.getValue('number', '123')).toStrictEqual(2);
    expect(testConfig.getValue('number', null)).toStrictEqual(2);
    expect(testConfig.getValue('number')).toStrictEqual(2);

    expect(testConfig.getValue('bool', '123')).toStrictEqual(true);
    expect(testConfig.getValue('bool', null)).toStrictEqual(true);
    expect(testConfig.getValue('bool')).toStrictEqual(true);

    expect(testConfig.getValue('object', '123')).toStrictEqual({
      key: 'value',
      key2: 123,
    });
    expect(testConfig.getValue('object', null)).toStrictEqual({
      key: 'value',
      key2: 123,
    });
    expect(testConfig.getValue('object')).toStrictEqual({
      key: 'value',
      key2: 123,
    });

    expect(testConfig.getValue('arr', '123')).toStrictEqual([1, 2, 'three']);
    expect(testConfig.getValue('arr', null)).toStrictEqual([1, 2, 'three']);
    expect(testConfig.getValue('arr')).toStrictEqual([1, 2, 'three']);
  });

  test('Test typed getting with matching types', () => {
    expect(testConfig.get('boolStr1', '123')).toStrictEqual('true');
    expect(testConfig.get('boolStr1', null)).toStrictEqual('true');
    // @ts-ignore intentional mistyping test
    expect(testConfig.get('boolStr1')).toStrictEqual('true');

    expect(testConfig.get('number', 123)).toStrictEqual(2);
    expect(testConfig.get('number', null)).toStrictEqual(2);
    // @ts-ignore intentional mistyping test
    expect(testConfig.get('number')).toStrictEqual(2);

    expect(testConfig.get('bool', false)).toStrictEqual(true);
    expect(testConfig.get('bool', null)).toStrictEqual(true);
    // @ts-ignore intentional mistyping test
    expect(testConfig.get('bool')).toStrictEqual(true);

    expect(testConfig.get('object', {})).toStrictEqual({
      key: 'value',
      key2: 123,
    });
    expect(testConfig.get('object', null)).toStrictEqual({
      key: 'value',
      key2: 123,
    });
    // @ts-ignore intentional mistyping test
    expect(testConfig.get('object')).toStrictEqual({
      key: 'value',
      key2: 123,
    });

    expect(testConfig.get('arr', [])).toStrictEqual([1, 2, 'three']);
    expect(testConfig.get('arr', null)).toStrictEqual([1, 2, 'three']);
    // @ts-ignore intentional mistyping test
    expect(testConfig.get('arr')).toStrictEqual([1, 2, 'three']);
  });

  test('Test typed getter mismatches', () => {
    expect(testConfig.get('boolStr1', 123)).toStrictEqual(123);
    expect(testConfig.get('number', '123')).toStrictEqual('123');
    expect(testConfig.get('bool', '123')).toStrictEqual('123');
    expect(testConfig.get('object', '123')).toStrictEqual('123');
    expect(testConfig.get('object', ['123'])).toStrictEqual(['123']);
    expect(testConfig.get('arr', {})).toStrictEqual({});
  });

  test('Behavior of dummy configs', () => {
    const dummyConfig = new DynamicConfig('configName');
    // @ts-ignore intentional mistyping test
    expect(dummyConfig.get()).toEqual({});
    // @ts-ignore intentional mistyping test
    expect(dummyConfig.get('test_field')).toBeNull();
    expect(dummyConfig.get('str', 'default_value')).toEqual('default_value');
    expect(dummyConfig.get('bool', true)).toEqual(true);
    expect(dummyConfig.get('number', 1.234)).toEqual(1.234);
    expect(dummyConfig.get('arr', [1, 2, 3])).toEqual([1, 2, 3]);
    expect(dummyConfig.get('obj', { key: 'value' })).toEqual({ key: 'value' });

    // @ts-ignore intentional mistyping test
    expect(dummyConfig.getValue()).toEqual({});
    expect(dummyConfig.getValue('test_field')).toEqual(null);
    expect(dummyConfig.getValue('str', 'default_value')).toEqual(
      'default_value',
    );
    expect(dummyConfig.getValue('bool', true)).toEqual(true);
    expect(dummyConfig.getValue('number', 1.234)).toEqual(1.234);
    expect(dummyConfig.getValue('arr', [1, 2, 3])).toEqual([1, 2, 3]);
    expect(dummyConfig.getValue('obj', { key: 'value' })).toEqual({
      key: 'value',
    });
  });
});
