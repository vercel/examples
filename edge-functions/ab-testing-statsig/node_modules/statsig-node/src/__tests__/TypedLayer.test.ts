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
      arr: [1, 2, 'three'],
    },
    'default',
  );

  type TestObject = {
    key: string;
    key2: number;
  };

  type OtherTestObject = {
    someProp: string;
    otherProp: number;
  };

  const isTestObject = (obj: any): obj is TestObject => {
    return typeof obj?.key === 'string' && typeof obj?.key2 === 'number';
  };

  const isOtherTestObject = (obj: any): obj is OtherTestObject => {
    return (
      typeof obj?.someProp === 'string' && typeof obj?.otherProp === 'number'
    );
  };

  beforeEach(() => {
    expect.hasAssertions();
  });

  test('Test typed get', () => {
    expect(testLayer.get('bool', 3)).toStrictEqual(3);
    expect(testLayer.getValue('111', 222)).toStrictEqual(222);
    expect(testLayer.get('numberStr2', 'test')).toStrictEqual('3.3');
    expect(testLayer.get('boolStr1', 'test')).toStrictEqual('true');
    expect(testLayer.get('numberStr2', 17)).toStrictEqual(17);
    expect(testLayer.get('arr', ['test'])).toStrictEqual([1, 2, 'three']);
    expect(testLayer.get('object', ['test'])).toStrictEqual(['test']);
    expect(testLayer.get('object', {})).toStrictEqual({
      key: 'value',
      key2: 123,
    });
  });

  test('Test optional type guard when runtime check succeeds', () => {
    const defaultTestObject: TestObject = {
      key: 'default',
      key2: 0,
    };
    expect(
      testLayer.get('object', defaultTestObject, isTestObject),
    ).toStrictEqual({
      key: 'value',
      key2: 123,
    });
  });

  test('Test optional type guard default', () => {
    const defaultOtherTestObject: OtherTestObject = {
      someProp: 'other',
      otherProp: 0,
    };
    expect(
      testLayer.get('object', defaultOtherTestObject, isOtherTestObject),
    ).toStrictEqual(defaultOtherTestObject);
  });

  test('Test optional type guard default when given a narrower type', () => {
    const narrowerOtherTestObject = {
      someProp: 'specificallyThisString',
      otherProp: 0,
    } as const;
    expect(
      testLayer.get('object', narrowerOtherTestObject, isOtherTestObject),
    ).toStrictEqual(narrowerOtherTestObject);
  });

  test('Test optional type guard default when given a wider type', () => {
    const widerOtherTestObject = {
      someProp: 'Wider type than OtherTestObject',
    };
    expect(
      testLayer.get('object', widerOtherTestObject, isOtherTestObject),
    ).toStrictEqual(widerOtherTestObject);
  });

  test('Test optional type guard default when given null', () => {
    expect(testLayer.get('object', null, isOtherTestObject)).toBeNull();
  });

  test('Test optional type guard default given undefined', () => {
    expect(testLayer.get('object', undefined, isOtherTestObject)).toBeNull();
    expect(testLayer.get('object', null, isOtherTestObject)).toBeNull();
  });
});
