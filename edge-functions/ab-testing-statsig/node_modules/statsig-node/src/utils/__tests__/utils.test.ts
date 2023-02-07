const {
  clone,
  getBoolValue,
  getNumericValue,
  isUserIdentifiable,
} = require('../core');

describe('Verify behavior of core utility functions', () => {
  beforeEach(() => {
    expect.hasAssertions();
  });

  test('Test clone', () => {
    expect(clone()).toBeNull();
    expect(clone({})).toStrictEqual({});
    expect(clone(null)).toBeNull();
    expect(clone({ test: 123 })).toStrictEqual({ test: 123 });
  });

  test('Test getNumericValue', () => {
    expect(getNumericValue(null)).toStrictEqual(null);
    expect(getNumericValue()).toStrictEqual(null);
    expect(getNumericValue(10)).toStrictEqual(10);
    expect(getNumericValue({})).toStrictEqual(null);
    expect(getNumericValue('20')).toStrictEqual(20);
    expect(getNumericValue(10.0)).toStrictEqual(10.0);
    expect(getNumericValue(false)).toStrictEqual(0);
    expect(getNumericValue(true)).toStrictEqual(1);
    expect(getNumericValue('13.1')).toStrictEqual(13.1);
  });

  test('Test getBoolValue', () => {
    expect(getBoolValue(null)).toBeNull();
    expect(getBoolValue()).toBeNull();
    expect(getBoolValue(10)).toBeNull();
    expect(getBoolValue({})).toBeNull();
    expect(getBoolValue('20')).toBeNull();
    expect(getBoolValue(10.0)).toBeNull();
    expect(getBoolValue(false)).toStrictEqual(false);
    expect(getBoolValue(true)).toStrictEqual(true);
    expect(getBoolValue('true')).toStrictEqual(true);
    expect(getBoolValue('false 123')).toBeNull();
    expect(getBoolValue('false')).toStrictEqual(false);
  });

  test('Test isUserIdentifiable', () => {
    expect(isUserIdentifiable(null)).toStrictEqual(false);
    expect(isUserIdentifiable({})).toStrictEqual(false);
    expect(isUserIdentifiable()).toStrictEqual(false);
    expect(isUserIdentifiable('test_user')).toStrictEqual(false);
    expect(isUserIdentifiable({ id: '123' })).toStrictEqual(false);
    expect(isUserIdentifiable({ userID: '123' })).toStrictEqual(true);
    expect(isUserIdentifiable({ userID: 123 })).toStrictEqual(true);
  });
});
