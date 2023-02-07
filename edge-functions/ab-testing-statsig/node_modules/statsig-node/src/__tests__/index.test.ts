// @ts-nocheck
import ConfigEvaluation from '../ConfigEvaluation';

// const statsig = require("../index")

import statsig from '../index';
import LogEvent from '../LogEvent';
import DynamicConfig from '../DynamicConfig';
import { StatsigUninitializedError } from '../Errors';
const exampleConfigSpecs = require('./jest.setup');

jest.useFakeTimers();

let flushedEventCount = 0;

jest.mock('node-fetch', () => jest.fn());
// @ts-ignore
const fetch = require('node-fetch');
// @ts-ignore
fetch.mockImplementation((url, params) => {
  if (url.includes('check_gate')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          name: 'gate_server',
          value: true,
          rule_id: 'rule_id_gate_server',
        }),
    });
  } else if (url.includes('get_config')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          name: 'config_server',
          value: {
            string: '123',
            number: 123,
          },
          rule_id: 'rule_id_config_server',
        }),
    });
  } else if (url.includes('log_event') || url.includes('rgstr')) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const events = JSON.parse(params.body).events;
        flushedEventCount += events.length;
        resolve({
          ok: true,
          json: () => {
            return Promise.resolve({});
          },
        });
      }, 10);
    });
  }
  return Promise.reject();
});

describe('Verify behavior of top level index functions', () => {
  const secretKey = 'secret-key';
  const str_64 =
    '1234567890123456789012345678901234567890123456789012345678901234';

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();

    try {
      statsig.shutdown();
    } catch (e) {}

    statsig._instance = null;
    flushedEventCount = 0;

    // ensure Date.now() returns the same value in each test
    let now = Date.now();
    jest.spyOn(global.Date, 'now').mockImplementation(() => now);
  });

  test('Verify initialize() returns an error when a secret key is not provided', async () => {
    return expect(statsig.initialize()).rejects.toEqual(
      new Error(
        'Invalid key provided.  You must use a Server Secret Key from the Statsig console with the node-js-server-sdk',
      ),
    );
  });

  test('Verify initialize() returns an error when an empty secret key is provided', async () => {
    return expect(statsig.initialize('')).rejects.toEqual(
      new Error(
        'Invalid key provided.  You must use a Server Secret Key from the Statsig console with the node-js-server-sdk',
      ),
    );
  });

  test('Verify initialize() returns an error when a client key is provided', async () => {
    return expect(
      statsig.initialize('client-abcdefg1234567890'),
    ).rejects.toEqual(
      new Error(
        'Invalid key provided.  You must use a Server Secret Key from the Statsig console with the node-js-server-sdk',
      ),
    );
  });

  test('Verify logEvent() throws if called before initialize()', () => {
    expect.assertions(1);

    try {
      statsig.logEvent({ userID: '12345' }, 'my_event');
    } catch (e) {
      expect(e).toEqual(new StatsigUninitializedError());
    }
  });

  test('Verify cannot call checkGate() before initialize()', async () => {
    expect.assertions(2);

    try {
      await statsig.checkGate({ userID: '12345' }, 'my_gate');
    } catch (e) {
      expect(e).toEqual(new StatsigUninitializedError());
    }

    expect(statsig._instance).toBeNull();
  });

  test('Verify cannot call getConfig() before initialize()', async () => {
    expect.assertions(2);

    try {
      await statsig.getConfig({ userID: '12345' }, 'my_config');
    } catch (e) {
      expect(e).toEqual(new StatsigUninitializedError());
    }

    expect(statsig._instance).toBeNull();
  });

  test('Verify cannot call getExperiment() before initialize()', async () => {
    expect.assertions(2);

    try {
      await statsig.getExperiment({ userID: '12345' }, 'my_exp');
    } catch (e) {
      expect(e).toEqual(new StatsigUninitializedError());
    }

    expect(statsig._instance).toBeNull();
  });

  test('Verify internal components are initialized properly after initialize() is called with a secret Key', async () => {
    expect.assertions(5);
    return statsig.initialize(secretKey).then(() => {
      expect(statsig._instance._secretKey).toBe(secretKey);
      expect(statsig._instance._logger).toBeDefined();
      expect(statsig._instance._options.api).toBe('https://statsigapi.net/v1');
      expect(statsig._instance._ready).toBe(true);
      expect(statsig._instance._evaluator.initialized).toBe(true);
    });
  });

  test('Verify cannot call checkGate() with no gate name', () => {
    expect.assertions(2);

    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
      // @ts-ignore intentionally testing incorrect param type
      expect(statsig.checkGate(null)).rejects.toEqual(
        new Error('Lookup key must be a non-empty string'),
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  test('Verify cannot call checkGate() with invalid gate name', () => {
    expect.assertions(2);

    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
      // @ts-ignore intentionally testing incorrect param type
      expect(statsig.checkGate({ userID: '123' }, 12)).rejects.toEqual(
        new Error('Lookup key must be a non-empty string'),
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  test('cannot call checkGate(), getConfig(), or getExperiment() with no user or userID or customID', async () => {
    expect.assertions(6);

    await statsig.initialize(secretKey);
    await expect(statsig.checkGate(null, 'test_gate')).rejects.toEqual(
      new Error(
        'Must pass a valid user with a userID or customID for the server SDK to work. See https://docs.statsig.com/messages/serverRequiredUserID/ for more details.',
      ),
    );
    await expect(
      statsig.checkGate({ email: '123@gmail.com' }, 'test_gate'),
    ).rejects.toEqual(
      new Error(
        'Must pass a valid user with a userID or customID for the server SDK to work. See https://docs.statsig.com/messages/serverRequiredUserID/ for more details.',
      ),
    );

    await expect(statsig.getConfig(null, 'test_config')).rejects.toEqual(
      new Error(
        'Must pass a valid user with a userID or customID for the server SDK to work. See https://docs.statsig.com/messages/serverRequiredUserID/ for more details.',
      ),
    );
    await expect(
      statsig.getConfig({ email: '123@gmail.com' }, 'test_config'),
    ).rejects.toEqual(
      new Error(
        'Must pass a valid user with a userID or customID for the server SDK to work. See https://docs.statsig.com/messages/serverRequiredUserID/ for more details.',
      ),
    );

    await expect(statsig.getExperiment(null, 'test_exp')).rejects.toEqual(
      new Error(
        'Must pass a valid user with a userID or customID for the server SDK to work. See https://docs.statsig.com/messages/serverRequiredUserID/ for more details.',
      ),
    );
    await expect(
      statsig.getExperiment({ email: '123@gmail.com' }, 'test_exp'),
    ).rejects.toEqual(
      new Error(
        'Must pass a valid user with a userID or customID for the server SDK to work. See https://docs.statsig.com/messages/serverRequiredUserID/ for more details.',
      ),
    );
  });

  test('can call checkGate(), getConfig(), or getExperiment() with no userID if you provide a customID', async () => {
    expect.assertions(4);

    await statsig.initialize(secretKey);
    await expect(
      statsig.checkGate({ customIDs: { test: '123' } }, 'test_gate123'),
    ).resolves.toEqual(false);
    const config = await statsig.getConfig(
      { customIDs: { test: '123' } },
      'test_config123',
    );
    expect(config.getValue()).toEqual({});

    const exp = await statsig.getExperiment(
      { customIDs: { test: '123' } },
      'test_exp',
    );
    expect(exp.getValue()).toEqual({});

    const layer = await statsig.getLayer(
      { customIDs: { test: '123' } },
      'test_exp',
    );
    expect(layer.get('test', 14)).toEqual(14);
  });

  test('Verify cannot call getConfig() or getExperiment() with no config name', () => {
    expect.assertions(3);

    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
      // @ts-ignore intentionally testing incorrect param type
      expect(statsig.getConfig({ userID: '123' })).rejects.toEqual(
        new Error('Lookup key must be a non-empty string'),
      );
      // @ts-ignore intentionally testing incorrect param type
      expect(statsig.getExperiment({ userID: '123' })).rejects.toEqual(
        new Error('Lookup key must be a non-empty string'),
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  test('Verify cannot call getConfig() with invalid config name', () => {
    expect.assertions(3);

    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
      // @ts-ignore intentionally testing incorrect param type
      expect(statsig.getConfig({ userID: '123' }, false)).rejects.toEqual(
        new Error('Lookup key must be a non-empty string'),
      );
      // @ts-ignore intentionally testing incorrect param type
      expect(statsig.getExperiment({ userID: '123' }, false)).rejects.toEqual(
        new Error('Lookup key must be a non-empty string'),
      );
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  test('Verify when Evaluator fails, checkGate() returns correct value and does not lot an exposure', async () => {
    expect.assertions(2);

    await statsig.initialize(secretKey);
    jest
      .spyOn(statsig._instance._evaluator, 'checkGate')
      .mockImplementation((user, gateName) => {
        return ConfigEvaluation.fetchFromServer();
      });
    let user = { userID: 123, privateAttributes: { secret: 'do not log' } };
    let gateName = 'gate_server';

    const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');

    await expect(statsig.checkGate(user, gateName)).resolves.toStrictEqual(
      true,
    );
    expect(spy).toHaveBeenCalledTimes(0);
  });

  test('Verify Evaluator returns correct value for checkGate() and logs an exposure correctly', async () => {
    expect.assertions(3);

    await statsig.initialize(secretKey);

    jest
      .spyOn(statsig._instance._evaluator, 'checkGate')
      .mockImplementation((user, gateName) => {
        if (gateName === 'gate_pass') {
          return new ConfigEvaluation(true, 'rule_id_pass', [
            { gate: 'dependent_gate', gateValue: 'true', ruleID: 'rule_22' },
          ]);
        }

        if (gateName === 'gate_server') {
          return ConfigEvaluation.fetchFromServer();
        }

        return new ConfigEvaluation(false, 'rule_id_fail');
      });

    let user = { userID: '123', privateAttributes: { secret: 'do not log' } };
    let gateName = 'gate_pass';

    const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
    const gateExposure = new LogEvent('statsig::gate_exposure');
    gateExposure.setUser({
      userID: '123',
    });
    gateExposure.setMetadata({
      gate: gateName,
      gateValue: String(true),
      ruleID: 'rule_id_pass',
    });
    gateExposure.setSecondaryExposures([
      { gate: 'dependent_gate', gateValue: 'true', ruleID: 'rule_22' },
    ]);

    await expect(statsig.checkGate(user, gateName)).resolves.toStrictEqual(
      true,
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(gateExposure);
  });

  test('Verify Evaluator returns correct value (for failed gates) for checkGate() and logs an exposure correctly', async () => {
    expect.assertions(3);

    // also set and verify environment is passed on to user as statsigEnvironment
    await statsig.initialize(secretKey, {
      environment: { tier: 'production' },
    });

    jest
      .spyOn(statsig._instance._evaluator, 'checkGate')
      .mockImplementation((user, gateName) => {
        if (gateName === 'gate_pass') {
          return new ConfigEvaluation(true, 'rule_id_pass', []);
        }

        if (gateName === 'gate_server') {
          return ConfigEvaluation.fetchFromServer();
        }

        return new ConfigEvaluation(false, 'rule_id_fail', []);
      });

    let user = { userID: '123', privateAttributes: { secret: 'do not log' } };
    let gateName = 'gate_fail';

    const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
    const gateExposure = new LogEvent('statsig::gate_exposure');
    gateExposure.setUser({
      userID: '123',
      // @ts-ignore
      statsigEnvironment: { tier: 'production' },
    });
    gateExposure.setMetadata({
      gate: gateName,
      gateValue: String(false),
      ruleID: 'rule_id_fail',
    });
    gateExposure.setSecondaryExposures([]);

    await expect(statsig.checkGate(user, gateName)).resolves.toStrictEqual(
      false,
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(gateExposure);
  });

  test('Verify when Evaluator fails to evaluate, getConfig() and getExperiment() return correct value and do not log exposures', async () => {
    expect.assertions(5);

    await statsig.initialize(secretKey);
    jest
      .spyOn(statsig._instance._evaluator, 'getConfig')
      .mockImplementation(() => {
        return ConfigEvaluation.fetchFromServer();
      });

    let user = { userID: 123, privateAttributes: { secret: 'do not log' } };
    let configName = 'config_server';

    const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');

    await statsig.getConfig(user, configName).then((data) => {
      expect(data.getValue('number')).toStrictEqual(123);
      expect(data.getValue('string')).toStrictEqual('123');
    });

    await statsig.getExperiment(user, configName).then((data) => {
      expect(data.getValue('number')).toStrictEqual(123);
      expect(data.getValue('string')).toStrictEqual('123');
    });

    expect(spy).toHaveBeenCalledTimes(0);
  });

  test('Verify when Evaluator evaluates successfully, getConfig() and getExperiment() return correct value and logs an exposure', async () => {
    expect.assertions(6);

    await statsig.initialize(secretKey);
    jest
      .spyOn(statsig._instance._evaluator, 'getConfig')
      .mockImplementation((_, configName) => {
        return new ConfigEvaluation(true, 'rule_id_config', [], {
          string: '12345',
          number: 12345,
        });
      });

    let user = { userID: '123', privateAttributes: { secret: 'do not log' } };
    let configName = 'config_downloaded';

    const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
    const configExposure = new LogEvent('statsig::config_exposure');
    configExposure.setUser({
      userID: '123',
    });
    configExposure.setMetadata({
      config: configName,
      ruleID: 'rule_id_config',
    });
    configExposure.setSecondaryExposures([]);

    await statsig.getConfig(user, configName).then((data) => {
      expect(data.getValue('number')).toStrictEqual(12345);
      expect(data.getValue('string')).toStrictEqual('12345');
    });

    await statsig.getExperiment(user, configName).then((data) => {
      expect(data.getValue('number')).toStrictEqual(12345);
      expect(data.getValue('string')).toStrictEqual('12345');
    });

    expect(spy).toHaveBeenCalledTimes(1); // Dedupe logic kicks in
    expect(spy).toHaveBeenCalledWith(configExposure);
  });

  test('Verify that getConfig() and getExperiment() are deduped with same metadata', async () => {
    expect.assertions(1);

    await statsig.initialize(secretKey);

    jest
      .spyOn(statsig._instance._evaluator, 'getConfig')
      .mockImplementation((_, configName) => {
        return new ConfigEvaluation(true, 'rule_id_config', [], {
          string: '12345',
          number: 12345,
        });
      });

    let user = { userID: '123', privateAttributes: { secret: 'do not log' } };
    let configName = 'config_downloaded';

    const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
    for (let ii = 0; ii < 10000; ii++) {
      await statsig.getConfig(user, configName);
    }

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('Verify that getConfig() and getExperiment() are not deduped with different user', async () => {
    expect.assertions(1);

    await statsig.initialize(secretKey);

    jest
      .spyOn(statsig._instance._evaluator, 'getConfig')
      .mockImplementation((_, configName) => {
        return new ConfigEvaluation(true, 'rule_id_config', [], {
          string: '12345',
          number: 12345,
        });
      });

    let user = { userID: '123', privateAttributes: { secret: 'do not log' } };
    let configName = 'config_downloaded';

    const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
    for (let ii = 0; ii < 10000; ii++) {
      user.userID = ii + '';
      await statsig.getConfig(user, configName);
    }

    expect(spy).toHaveBeenCalledTimes(10000);
  });

  test('Verify that getConfig() and getExperiment() are not deduped with different metadata', async () => {
    expect.assertions(1);
    await statsig.initialize(secretKey);

    let user = { userID: 123, privateAttributes: { secret: 'do not log' } };
    let configName = 'config_downloaded';

    const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
    for (let ii = 0; ii < 10000; ii++) {
      // @ts-ignore
      jest
        .spyOn(statsig._instance._evaluator, 'getConfig')
        .mockImplementation((_, configName) => {
          return new ConfigEvaluation(true, 'rule_id_config_' + ii, [], {
            string: '12345',
          });
        });
      await statsig.getConfig(user, configName);
    }

    expect(spy).toHaveBeenCalledTimes(10000);
  });

  test('that getConfig() and getExperiment() return an empty DynamicConfig when the config name does not exist', async () => {
    expect.assertions(3);

    await statsig.initialize(secretKey);

    jest
      .spyOn(statsig._instance._evaluator, 'getConfig')
      .mockImplementation(() => {
        return new ConfigEvaluation(false);
      });

    const configName = 'non_existent_config';
    let config = new DynamicConfig(configName);

    const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
    await statsig.getConfig({ userID: '12345' }, configName).then((data) => {
      expect(data).toEqual(config);
    });

    await statsig
      .getExperiment({ userID: '12345' }, configName)
      .then((data) => {
        expect(data).toEqual(config);
      });

    expect(spy).toHaveBeenCalledTimes(1); // Dedupe logic kicks in
  });

  test('Verify logEvent() does not log if eventName is null', async () => {
    expect.assertions(1);
    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
      statsig.logEvent({ userID: '12345' }, null);
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  test('Verify logEvent() does not log if eventName is empty string', async () => {
    expect.assertions(1);
    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
      statsig.logEvent({ userID: '12345' }, '');
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  test('Verify logEvent() does not log if eventName is an object', async () => {
    expect.assertions(1);
    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
      // @ts-ignore intentionally testing incorrect param type
      statsig.logEvent({ userID: '12345' }, { name: 'event' });
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  test('Verify logEvent can log a 0 value', async () => {
    const statsig = require('../index');
    expect.assertions(2);
    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig._instance._logger, 'log');
      statsig.logEvent({ userID: '123' }, 'test', 0);

      const logEvent = new LogEvent('test');
      logEvent.setMetadata(null);
      logEvent.setUser({ userID: '123' });
      logEvent.setValue(0);
      expect(spy).toBeCalledWith(logEvent);
      expect(logEvent.toObject().value).toEqual(0);
    });
  });

  test('Verify logEvent can log an empty string value', async () => {
    const statsig = require('../index');
    expect.assertions(2);
    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig._instance._logger, 'log');
      statsig.logEvent({ userID: '123' }, 'test', '');

      const logEvent = new LogEvent('test');
      logEvent.setMetadata(null);
      logEvent.setUser({ userID: '123' });
      logEvent.setValue('');
      expect(spy).toBeCalledWith(logEvent);
      expect(logEvent.toObject().value).toEqual('');
    });
  });

  test('Verify logEventObject can override timestamp', async () => {
    expect.assertions(1);
    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
      statsig.logEventObject({
        eventName: 'event',
        time: 123,
        user: { userID: '123', privateAttributes: { secret: 'do not log' } },
      });

      const logEvent = new LogEvent('event');
      logEvent.setMetadata(null);
      logEvent.setUser({ userID: '123' });
      logEvent.setValue(null);
      logEvent.setTime(123);
      expect(spy).toBeCalledWith(logEvent);
    });
  });

  test('Verify Event is logged without user', async () => {
    expect.assertions(1);
    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
      statsig.logEvent(null, 'event', 1, { price: '2' });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  test('Verify Event is logged', async () => {
    expect.assertions(1);
    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
      statsig.logEvent({ userID: '12345' }, 'event', 1, { price: '2' });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  test('Verify Event is logged', async () => {
    expect.assertions(1);
    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
      statsig.logEvent({ userID: 12345 }, 'event', 1, { price: '2' });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  test('Verify big user object and log event are getting trimmed', async () => {
    expect.assertions(2);
    let str_1k = str_64;
    // create a 1k long string
    for (let i = 0; i < 5; i++) {
      str_1k += str_1k;
    }
    expect(str_1k.length).toBe(2048);
    return statsig.initialize(secretKey).then(() => {
      let bigUser = {
        userID: str_64 + 'more',
        email: 'jest@statsig.com',
        custom: { extradata: str_1k },
      };

      const spy = jest.spyOn(statsig['_instance']['_logger'], 'log');
      statsig.logEvent(bigUser, str_64 + 'extra', str_64 + 'extra', {
        extradata: str_1k,
      });

      const trimmedEvent = new LogEvent(str_64.substring(0, 64));
      trimmedEvent.setUser({
        userID: str_64,
        email: 'jest@statsig.com',
        custom: {
          statsig_error: 'User object length too large',
        },
      });
      trimmedEvent.setValue(str_64.substring(0, 64));
      trimmedEvent.setMetadata({ statsig_error: 'Metadata length too large' });
      expect(spy).toBeCalledWith(trimmedEvent);
    });
  });

  test('Verify shutdown makes the SDK not ready and clears all the timers', async () => {
    // @ts-ignore
    const fetch = require('node-fetch');
    expect.assertions(6);
    return statsig.initialize(secretKey).then(() => {
      const spy = jest.spyOn(statsig['_instance']['_logger'], 'flush');
      statsig.shutdown();
      expect(spy).toHaveBeenCalledTimes(1);
      // @ts-ignore
      expect(statsig._ready).toBeFalsy();

      expect(statsig._instance._logger.flushTimer).toBeNull();
      expect(statsig._instance._logger.deduperTimer).toBeNull();

      expect(statsig._instance._evaluator.store.syncTimer).toBeNull();
      expect(statsig._instance._evaluator.store.idListsSyncTimer).toBeNull();
    });
  });

  test('calling initialize() multiple times will only make 1 request and resolve together', async () => {
    expect.assertions(3);

    // initialize() twice simultaneously results in 1 promise
    const v1 = statsig.initialize(secretKey);
    const v2 = statsig.initialize(secretKey);
    await expect(v1).resolves.not.toThrow();
    await expect(v2).resolves.not.toThrow();

    // initialize() again after the first one completes resolves right away
    await expect(statsig.initialize(secretKey)).resolves.not.toThrow();
  });

  test('statsigoptions bootstrapValues is being used to bootstrap rules', async () => {
    const jsonResponse = {
      time: Date.now(),
      feature_gates: [
        exampleConfigSpecs.gate,
        exampleConfigSpecs.disabled_gate,
      ],
      dynamic_configs: [exampleConfigSpecs.config],
      layer_configs: [],
      has_updates: true,
    };

    await statsig.initialize(secretKey, {
      bootstrapValues: JSON.stringify(jsonResponse),
    });

    let passGate = await statsig.checkGate(
      { userID: '12345', email: 'tore@nfl.com' },
      exampleConfigSpecs.gate.name,
    );
    let failGate = await statsig.checkGate(
      { userID: '12345', email: 'tore@gmail.com' },
      exampleConfigSpecs.gate.name,
    );
    expect(passGate).toBe(true);
    expect(failGate).toBe(false);
    // TODO verify network gates overwrite bootstrap values
  });

  test('flush() works', async () => {
    jest.advanceTimersByTime(100);
    flushedEventCount = 0;

    expect.assertions(2);

    await statsig.initialize(secretKey);
    statsig.logEvent({ userID: '123' }, 'my_event1');
    statsig.logEvent({ userID: '123' }, 'my_event2');
    statsig.logEvent({ userID: '123' }, 'my_event3');
    statsig.checkGate({ userID: '456' }, exampleConfigSpecs.gate.name);
    statsig.checkGate({ userID: '456' }, exampleConfigSpecs.gate.name);

    const flushPromise = statsig.flush();
    expect(flushedEventCount).toEqual(0);
    jest.advanceTimersByTime(20);
    await flushPromise;
    expect(flushedEventCount).toEqual(4);
  });
});
