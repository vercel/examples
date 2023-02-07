import * as statsigsdk from '../index';
// @ts-ignore
const statsig = statsigsdk.default;

let hitNetwork = false;

jest.mock('node-fetch', () => jest.fn());
// @ts-ignore
const fetch = require('node-fetch');
// @ts-ignore
fetch.mockImplementation((url) => {
  hitNetwork = true;
  return Promise.reject(new Error('Should not access network in local mode'));
});

describe('Test local mode with overrides', () => {
  jest.mock('node-fetch', () => jest.fn());

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();

    statsig._instance = null;
  });

  it('initalize resolves and all values are defualts', async () => {
    await statsig.initialize('secret-key', { localMode: true });
    expect(hitNetwork).toEqual(false);
    expect(statsig.checkGate({ userID: 'test' }, 'any_gate')).resolves.toEqual(
      false,
    );

    const config = await statsig.getConfig({ userID: 'test' }, 'any_config');
    expect(config.getValue()).toEqual({});

    const experiment = await statsig.getExperiment(
      { userID: 'test' },
      'any_experiment',
    );
    expect(experiment.getValue()).toEqual({});

    statsig.shutdown();
    expect(hitNetwork).toEqual(false);
  });

  it('gate overrides work', async () => {
    await statsig.initialize('secret-key', { localMode: true });
    expect(hitNetwork).toEqual(false);
    const userOne = { userID: '1', email: 'testuser@statsig.com' };
    const userTwo = { userID: '2', email: 'test@statsig.com' };
    expect(statsig.checkGate(userOne, 'override_gate')).resolves.toEqual(false);
    expect(statsig.checkGate(userTwo, 'override_gate')).resolves.toEqual(false);

    statsig.overrideGate('override_gate', true, '1');
    expect(statsig.checkGate(userOne, 'override_gate')).resolves.toEqual(true);
    expect(statsig.checkGate(userTwo, 'override_gate')).resolves.toEqual(false);

    statsig.overrideGate('override_gate', false, '1');
    statsig.overrideGate('override_gate', true, '2');
    expect(statsig.checkGate(userOne, 'override_gate')).resolves.toEqual(false);
    expect(statsig.checkGate(userTwo, 'override_gate')).resolves.toEqual(true);

    statsig.overrideGate('override_gate', true);
    expect(statsig.checkGate(userOne, 'override_gate')).resolves.toEqual(false);
    expect(statsig.checkGate(userTwo, 'override_gate')).resolves.toEqual(true);
    expect(
      statsig.checkGate({ userID: 'new_user' }, 'override_gate'),
    ).resolves.toEqual(true);

    // non boolean wont override
    // @ts-ignore
    statsig.overrideGate('different_gate', 'not a boolean');
    expect(statsig.checkGate(userOne, 'different_gate')).resolves.toEqual(
      false,
    );
    expect(statsig.checkGate(userTwo, 'different_gate')).resolves.toEqual(
      false,
    );

    statsig.shutdown();
    expect(hitNetwork).toEqual(false);
  });

  it('config overrides work', async () => {
    await statsig.initialize('secret-key', { localMode: true });
    expect(hitNetwork).toEqual(false);
    const userOne = { userID: '1', email: 'testuser@statsig.com' };
    const userTwo = { userID: '2', email: 'test@statsig.com' };
    let u1config = await statsig.getConfig(userOne, 'override_config');
    expect(u1config.getValue()).toEqual({});
    let u2config = await statsig.getConfig(userTwo, 'override_config');
    expect(u2config.getValue()).toEqual({});

    statsig.overrideConfig('override_config', { test: 'abc' }, '1');
    u1config = await statsig.getConfig(userOne, 'override_config');
    expect(u1config.getValue()).toEqual({ test: 'abc' });
    u2config = await statsig.getConfig(userTwo, 'override_config');
    expect(u2config.getValue()).toEqual({});

    statsig.overrideConfig('override_config', { test: 123 }, '2');
    statsig.overrideConfig('override_config', {}, '1');
    u1config = await statsig.getConfig(userOne, 'override_config');
    expect(u1config.getValue()).toEqual({});
    u2config = await statsig.getConfig(userTwo, 'override_config');
    expect(u2config.getValue()).toEqual({ test: 123 });

    statsig.overrideConfig('override_config', { all: true });
    u1config = await statsig.getConfig(userOne, 'override_config');
    expect(u1config.getValue()).toEqual({});
    u2config = await statsig.getConfig(userTwo, 'override_config');
    expect(u2config.getValue()).toEqual({ test: 123 });
    const u3config = await statsig.getConfig(
      { userID: 'new_user' },
      'override_config',
    );
    expect(u3config.getValue()).toEqual({ all: true });

    // non objects wont override
    // @ts-ignore
    statsig.overrideConfig('different_config', 'not an object');
    u1config = await statsig.getConfig(userOne, 'different_config');
    expect(u1config.getValue()).toEqual({});

    statsig.shutdown();
    expect(hitNetwork).toEqual(false);
  });

  describe('Layer overrides', () => {
    beforeEach(async () => {
      await statsig.initialize('secret-key', { localMode: true });
      expect(hitNetwork).toEqual(false);
    });

    it('returns fallback values when there are no overrides', async () => {
      let layer = await statsig.getLayer({ userID: 'a-user' }, 'a_layer');
      expect(layer.get('a_param', 'fallback')).toEqual('fallback');

      layer = await statsig.getLayer({ userID: 'b-user' }, 'a_layer');
      expect(layer.get('a_param', 'fallback')).toEqual('fallback');
    });

    it('returns override values for a specific user', async () => {
      statsig.overrideLayer('a_layer', { a_param: 'a_value' }, 'a-user');

      let layer = await statsig.getLayer({ userID: 'a-user' }, 'a_layer');
      expect(layer.get('a_param', 'fallback')).toEqual('a_value');

      layer = await statsig.getLayer({ userID: 'b-user' }, 'a_layer');
      expect(layer.get('a_param', 'fallback')).toEqual('fallback');
    });

    it('returns override values for all users', async () => {
      statsig.overrideLayer('a_layer', { a_param: 'a_value' });

      let layer = await statsig.getLayer({ userID: 'a-user' }, 'a_layer');
      expect(layer.get('a_param', 'fallback')).toEqual('a_value');

      layer = await statsig.getLayer({ userID: 'b-user' }, 'a_layer');
      expect(layer.get('a_param', 'fallback')).toEqual('a_value');
    });
  });
});
