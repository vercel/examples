import * as statsigsdk from '../index';
import exampleConfigSpecs from './jest.setup';
import TestDataAdapter, { TestSyncingDataAdapter } from './TestDataAdapter';
import {
  GatesForIdListTest,
} from './BootstrapWithDataAdapter.data';

jest.mock('node-fetch', () => jest.fn());
import fetch from 'node-fetch';
import { DataAdapterKey } from '../interfaces/IDataAdapter';

// @ts-ignore
const statsig = statsigsdk.default;

let isNetworkEnabled = false;

describe('DataAdapter', () => {
  // --> Project: "Statsig - evaluation test", "Kong" server key
  const dataAdapter = new TestDataAdapter();
  const statsigOptions = {
    dataAdapter: dataAdapter,
    environment: { tier: 'staging' },
  };
  const user = {
    userID: '12345',
    email: 'kenny@nfl.com',
    custom: { level: 9 },
  };

  async function loadStore(dataAdapter: TestDataAdapter) {
    // Manually load data into adapter store
    const gates: unknown[] = [];
    const configs: unknown[] = [];
    gates.push(exampleConfigSpecs.gate);
    configs.push(exampleConfigSpecs.config);
    const time = Date.now();
    await dataAdapter.initialize();
    await dataAdapter.set(
      DataAdapterKey.Rulesets,
      JSON.stringify({
        dynamic_configs: configs,
        feature_gates: gates,
        layer_configs: [],
        layers: [],
        has_updates: true,
      }),
      time,
    );
  }

  beforeEach(() => {
    isNetworkEnabled = false;

    //@ts-ignore
    fetch.mockImplementation((url: string) => {
      if (!isNetworkEnabled) {
        return Promise.reject();
      }

      if (url.includes('/download_config_specs')) {
        return Promise.resolve({
          ok: true,
          text: () =>
            Promise.resolve(
              JSON.stringify(require('./data/rulesets_e2e_full_dcs.json')),
            ),
        });
      }

      if (url.includes('/get_id_lists')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              user_id_list: {
                name: 'user_id_list',
                size: 20,
                url: 'https://fake.com/an_id_list_url',
                creationTime: 1666625173000,
                fileID: '1wkGp3X5k3mIQQR85D887n',
              },
            }),
        });
      }

      if (url.includes('https://fake.com/an_id_list_url')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(['+Z/hEKLio', '+M5m6a10x'].join('\n')),
          headers: {
            get: jest.fn((v) => {
              if (v.toLowerCase() === 'content-length') {
                return 20;
              }
            }),
          },
        });
      }

      return Promise.reject();
    });
  });

  afterEach(async () => {
    await dataAdapter.shutdown();
  });

  describe('when statsig is initialized', () => {
    beforeEach(() => {
      statsig._instance = null;
    });

    afterEach(async () => {
      await statsig.shutdown();
    });

    it('fetches config specs from adapter when network is down', async () => {
      await loadStore(dataAdapter);

      // Initialize without network
      await statsig.initialize('secret-key', {
        localMode: true,
        ...statsigOptions,
      });

      // Check gates
      const passesGate = await statsig.checkGate(user, 'nfl_gate');
      expect(passesGate).toEqual(true);

      // Check configs
      const config = await statsig.getConfig(
        user,
        exampleConfigSpecs.config.name,
      );
      expect(config.getValue('seahawks', null)).toEqual({
        name: 'Seattle Seahawks',
        yearFounded: 1974,
      });
    });

    it('updates config specs when with newer network values', async () => {
      expect.assertions(2);

      isNetworkEnabled = true;
      // Initialize with network
      await statsig.initialize('secret-key', statsigOptions);

      const { result } = await dataAdapter.get(DataAdapterKey.Rulesets);
      const configSpecs = JSON.parse(result!);

      // Check gates
      const gates = configSpecs['feature_gates'];

      const gateToCheck = gates.find(
        (gate) => gate.name === 'test_email_regex',
      );
      expect(gateToCheck.defaultValue).toEqual(false);

      // Check configs
      const configs = configSpecs['dynamic_configs'];

      const configToCheck = configs.find(
        (config) => config.name === 'test_custom_config',
      );
      expect(configToCheck.defaultValue).toEqual({
        header_text: 'new user test',
        foo: 'bar',
      });
    });

    it('updates id lists when with newer network values', async () => {
      isNetworkEnabled = true;
      await statsig.initialize('secret-key', statsigOptions);

      const lookup = await dataAdapter.get(DataAdapterKey.IDLists);
      expect(lookup.result).toEqual('["user_id_list"]');

      const ids = await dataAdapter.get(
        DataAdapterKey.IDLists + '::user_id_list',
      );
      expect(ids.result).toEqual('+Z/hEKLio\n+M5m6a10x\n');
    });

    it('correctly handles bootstrap and adapter at the same time', async () => {
      expect.assertions(2);

      await loadStore(dataAdapter);

      const jsonResponse = {
        time: Date.now(),
        feature_gates: [],
        dynamic_configs: [],
        layer_configs: [],
        has_updates: true,
      };

      // Bootstrap with adapter
      await statsig.initialize('secret-key', {
        localMode: true,
        bootstrapValues: JSON.stringify(jsonResponse),
        ...statsigOptions,
      });

      const { result } = await dataAdapter.get(DataAdapterKey.Rulesets);
      const configSpecs = JSON.parse(result!);

      // Check gates
      const gates = configSpecs['feature_gates'];

      const expectedGates: unknown[] = [];
      expectedGates.push(exampleConfigSpecs.gate);
      expect(gates).toEqual(expectedGates);

      // Check configs
      const configs = configSpecs['dynamic_configs'];

      const expectedConfigs: unknown[] = [];
      expectedConfigs.push(exampleConfigSpecs.config);
      expect(configs).toEqual(expectedConfigs);
    });
  });

  it('fetches single items', async () => {
    await statsig.initialize('secret-key', statsigOptions);

    dataAdapter.set('feature_gates', 'test123');

    // Check id lists
    const { result: gates } = await dataAdapter.get('feature_gates');

    expect(gates).toEqual('test123');
  });
  
  describe('when data adapter is used for syncing for rulesets', () => {
    const syncingDataAdapter = new TestSyncingDataAdapter([DataAdapterKey.Rulesets]);
    beforeEach(() => {
      statsig._instance = null;
    });

    afterEach(async () => {
      await statsig.shutdown();
    });

    it('updates config specs when adapter config spec update', async () => {
      // Initialize without network
      await statsig.initialize('secret-key', {
        localMode: true,
        dataAdapter: syncingDataAdapter,
        environment: { tier: 'staging' },
      });

      // Check gates
      const passesGate1 = await statsig.checkGate(user, 'nfl_gate');
      expect(passesGate1).toEqual(false);

      // Check configs
      const config1 = await statsig.getConfig(
        user,
        exampleConfigSpecs.config.name,
      );
      expect(config1.getValue('seahawks', null)).toEqual(null);

      await loadStore(syncingDataAdapter);

      statsig._instance._evaluator.store.syncInterval = 1000;
      statsig._instance._evaluator.store.syncTimer = null;
      statsig._instance._evaluator.store.pollForUpdates();
      await new Promise((_) => setTimeout(_, 1100));

      // Check gates after syncing
      const passesGate2 = await statsig.checkGate(user, 'nfl_gate');
      expect(passesGate2).toEqual(true);

      // Check configs after syncing
      const config2 = await statsig.getConfig(
        user,
        exampleConfigSpecs.config.name,
      );
      expect(config2.getValue('seahawks', null)).toEqual({
        name: 'Seattle Seahawks',
        yearFounded: 1974,
      });
    });

    it('still initializes id lists from the network', async () => {
      isNetworkEnabled = true;
      const time = Date.now();
      await syncingDataAdapter.initialize();
      await syncingDataAdapter.set(
        DataAdapterKey.Rulesets,
        JSON.stringify({
          dynamic_configs: [],
          feature_gates: GatesForIdListTest,
          layer_configs: [],
          layers: [],
          has_updates: true,
        }),
        time,
      );

      await statsig.initialize('secret-key', {
        dataAdapter: syncingDataAdapter,
        environment: { tier: 'staging' },
      });

      let value = await statsig.checkGate({ userID: 'a-user' }, 'test_id_list');
      expect(value).toBe(true);
  
      value = await statsig.checkGate({ userID: 'b-user' }, 'test_id_list');
      expect(value).toBe(true);
  
      value = await statsig.checkGate({ userID: 'c-user' }, 'test_id_list');
      expect(value).toBe(false);
    });
  });

  describe('when data adapter is used for syncing for rulesets and id lists', () => {
    const syncingDataAdapter = new TestSyncingDataAdapter([DataAdapterKey.Rulesets, DataAdapterKey.IDLists]);
    beforeEach(() => {
      statsig._instance = null;
    });

    afterEach(async () => {
      await statsig.shutdown();
    });

    it('updates config specs and id lists when adapter config spec update', async () => {
      // Initialize without network
      await statsig.initialize('secret-key', {
        localMode: true,
        dataAdapter: syncingDataAdapter,
        environment: { tier: 'staging' },
      });

      // Check gates
      let value1 = await statsig.checkGate({ userID: 'a-user' }, 'test_id_list');
      expect(value1).toBe(false);
  
      value1 = await statsig.checkGate({ userID: 'b-user' }, 'test_id_list');
      expect(value1).toBe(false);
  
      value1 = await statsig.checkGate({ userID: 'c-user' }, 'test_id_list');
      expect(value1).toBe(false);

      // Check configs
      const config1 = await statsig.getConfig(
        user,
        exampleConfigSpecs.config.name,
      );
      expect(config1.getValue('seahawks', null)).toEqual(null);

      const time = Date.now();
      await syncingDataAdapter.initialize();
      await syncingDataAdapter.set(
        DataAdapterKey.Rulesets,
        JSON.stringify({
          dynamic_configs: [exampleConfigSpecs.config],
          feature_gates: GatesForIdListTest,
          layer_configs: [],
          layers: [],
          has_updates: true,
        }),
        time,
      );
      syncingDataAdapter.set(DataAdapterKey.IDLists, '["user_id_list"]');
      syncingDataAdapter.set(DataAdapterKey.IDLists + '::user_id_list', '+Z/hEKLio\n+M5m6a10x\n')

      statsig._instance._evaluator.store.syncInterval = 1000;
      statsig._instance._evaluator.store.idListSyncInterval = 1000;
      statsig._instance._evaluator.store.syncTimer = null;
      statsig._instance._evaluator.store.idListsSyncTimer = null;
      statsig._instance._evaluator.store.pollForUpdates();
      await new Promise((_) => setTimeout(_, 1100));

      // Check gates after syncing
      let value2 = await statsig.checkGate({ userID: 'a-user' }, 'test_id_list');
      expect(value2).toBe(true);
  
      value2 = await statsig.checkGate({ userID: 'b-user' }, 'test_id_list');
      expect(value2).toBe(true);
  
      value2 = await statsig.checkGate({ userID: 'c-user' }, 'test_id_list');
      expect(value2).toBe(false);

      // Check configs after syncing
      const config2 = await statsig.getConfig(
        user,
        exampleConfigSpecs.config.name,
      );
      expect(config2.getValue('seahawks', null)).toEqual({
        name: 'Seattle Seahawks',
        yearFounded: 1974,
      });
    });
  });
});
