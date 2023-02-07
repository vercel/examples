import * as statsigsdk from '../index';
// @ts-ignore
let statsig = statsigsdk.default;

// @ts-ignore
const fetch = require('node-fetch');

jest.mock('node-fetch', () => jest.fn());

let logs = {};
// @ts-ignore
fetch.mockImplementation((url, params) => {
  if (url.includes('download_config_specs')) {
    return Promise.resolve({
      ok: true,
      text: () => Promise.resolve(CONFIG_SPEC_RESPONSE),
    });
  }

  if (url.includes('log_event')) {
    logs = JSON.parse(params.body);
    return Promise.resolve({
      ok: true,
    });
  }

  return Promise.reject();
});

const CONFIG_SPEC_RESPONSE = JSON.stringify(
  require('./data/layer_exposure_download_config_specs.json'),
);

describe('Layer Exposure Logging', () => {
  const user = { userID: 'dloomb' };

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
    logs = {};
    statsig._instance = null;
  });

  it('does not log on invalid types', async () => {
    await statsig.initialize('secret-key');

    const layer = await statsig.getLayer(user, 'unallocated_layer');
    layer.get('an_int', 'err');
    statsig.shutdown();

    expect(logs).toEqual({});
  });

  describe.each([['getValue'], ['get']])('with method "%s"', (method) => {
    it('logs layers without an allocated experiment correctly', async () => {
      await statsig.initialize('secret-key');

      let layer = await statsig.getLayer(user, 'unallocated_layer');
      layer[method]('an_int', 0);
      statsig.shutdown();

      expect(logs['events'].length).toEqual(1);

      expect(logs['events'][0]).toEqual(
        expect.objectContaining({
          metadata: expect.objectContaining({
            config: 'unallocated_layer',
            ruleID: 'default',
            allocatedExperiment: '',
            parameterName: 'an_int',
            isExplicitParameter: 'false',
          }),
        }),
      );
    });

    it('logs explicit and implicit parameters correctly', async () => {
      await statsig.initialize('secret-key');

      let layer = await statsig.getLayer(
        user,
        'explicit_vs_implicit_parameter_layer',
      );
      layer[method]('an_int', 0);
      layer[method]('a_string', 'err');
      statsig.shutdown();

      expect(logs['events'].length).toEqual(2);

      expect(logs['events'][0]).toEqual(
        expect.objectContaining({
          metadata: expect.objectContaining({
            config: 'explicit_vs_implicit_parameter_layer',
            ruleID: 'alwaysPass',
            allocatedExperiment: 'experiment',
            parameterName: 'an_int',
            isExplicitParameter: 'true',
          }),
        }),
      );

      expect(logs['events'][1]).toEqual(
        expect.objectContaining({
          metadata: expect.objectContaining({
            config: 'explicit_vs_implicit_parameter_layer',
            ruleID: 'alwaysPass',
            allocatedExperiment: '',
            parameterName: 'a_string',
            isExplicitParameter: 'false',
          }),
        }),
      );
    });

    it('logs different object types correctly', async () => {
      await statsig.initialize('secret-key');

      let layer = await statsig.getLayer(
        user,
        'different_object_type_logging_layer',
      );
      layer[method]('a_bool', false);
      layer[method]('an_int', 0);
      layer[method]('a_double', 0.0);
      layer[method]('a_long', 0);
      layer[method]('a_string', 'err');
      layer[method]('an_array', []);
      layer[method]('an_object', {});
      statsig.shutdown();

      expect(logs['events'].length).toEqual(7);

      expect(logs['events'][0]['metadata']['parameterName']).toEqual('a_bool');
      expect(logs['events'][1]['metadata']['parameterName']).toEqual('an_int');
      expect(logs['events'][2]['metadata']['parameterName']).toEqual(
        'a_double',
      );
      expect(logs['events'][3]['metadata']['parameterName']).toEqual('a_long');
      expect(logs['events'][4]['metadata']['parameterName']).toEqual(
        'a_string',
      );
      expect(logs['events'][5]['metadata']['parameterName']).toEqual(
        'an_array',
      );
      expect(logs['events'][6]['metadata']['parameterName']).toEqual(
        'an_object',
      );
    });

    it('logs the correct name and user values', async () => {
      await statsig.initialize('secret-key');

      let layer = await statsig.getLayer(
        { userID: 'dan', email: 'd@n.com' },
        'unallocated_layer',
      );
      layer[method]('an_int', 0);
      statsig.shutdown();

      expect(logs['events'].length).toEqual(1);

      expect(logs['events'][0]).toEqual(
        expect.objectContaining({
          eventName: 'statsig::layer_exposure',
          user: {
            userID: 'dan',
            email: 'd@n.com',
            privateAttributes: null,
          },
        }),
      );
    });

    it('does not log on get layer', async () => {
      await statsig.initialize('secret-key');

      await statsig.getLayer(user, 'unallocated_layer');
      statsig.shutdown();

      expect(logs).toEqual({});
    });

    it('does not log when shutdown', async () => {
      await statsig.initialize('secret-key');

      const layer = await statsig.getLayer(user, 'unallocated_layer');
      statsig.shutdown();

      layer[method]('an_int', 0);

      expect(logs).toEqual({});
    });

    it('does not log non existent keys', async () => {
      await statsig.initialize('secret-key');

      const layer = await statsig.getLayer(user, 'unallocated_layer');
      layer[method]('a_string', 'err');
      statsig.shutdown();

      expect(logs).toEqual({});
    });
  });
});
