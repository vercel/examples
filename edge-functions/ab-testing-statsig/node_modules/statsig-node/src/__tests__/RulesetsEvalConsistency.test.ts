const fs = require('fs');
const path = require('path');
import safeFetch from '../utils/safeFetch';
import * as statsigsdk from '../index';
// @ts-ignore
const statsig = statsigsdk.default;

let secret = process.env.test_api_key;
if (!secret) {
  try {
    secret = fs.readFileSync(
      path.resolve(
        __dirname,
        '../../../ops/secrets/prod_keys/statsig-rulesets-eval-consistency-test-secret.key',
      ),
      'utf8',
    );
  } catch {}
}

if (secret) {
  describe('Verify e2e behavior consistency of Statsig', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      jest.resetModules();
    });

    ['https://statsigapi.net/v1', 'https://staging.statsigapi.net/v1'].map(
      (url) =>
        test(`server and SDK evaluates gates to the same results on ${url}`, async () => {
          await _validateServerSDKConsistency(url);
        }),
    );
  });
} else {
  describe('fail for non employees', () => {
    test('Intended failing test. Proceed with pull request unless you are a Statsig employee.', () => {
      console.log(
        'THIS TEST IS EXPECTED TO FAIL FOR NON-STATSIG EMPLOYEES! If this is the only test failing, please proceed to submit a pull request. If you are a Statsig employee, chat with jkw.',
      );
      expect(true).toBe(false);
    });
  });
}

async function _validateServerSDKConsistency(api) {
  const response = await safeFetch(api + '/rulesets_e2e_test', {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'STATSIG-API-KEY': secret,
      'STATSIG-CLIENT-TIME': Date.now() + '',
    },
  });
  const testData = (await response.json()).data;

  const featureGateChecks = Object.keys(testData[0].feature_gates).length * 3;
  const dynamicConfigChecks =
    Object.keys(testData[0].dynamic_configs).length * 3;
  const layerConfigChecks = Object.keys(testData[0].layer_configs).length * 4;

  const totalChecks =
    testData.length *
    (featureGateChecks + dynamicConfigChecks + layerConfigChecks);
  expect.assertions(totalChecks);

  await statsig.initialize(secret, { api: api });
  const evaluator = statsig._instance._evaluator;

  const promises = testData.map(async (data) => {
    const user = data.user;
    const gates = data.feature_gates_v2;
    const configs = data.dynamic_configs;
    const layers = data.layer_configs;

    for (const name in gates) {
      const sdkResult = statsig._instance._evaluator.checkGate(user, name);
      const serverResult = gates[name];
      const sameExposure = compareSecondaryExposures(
        // @ts-ignore
        sdkResult.secondary_exposures,
        serverResult.secondary_exposures,
      );
      if (
        // @ts-ignore
        sdkResult.value !== serverResult.value ||
        // @ts-ignore
        sdkResult.rule_id !== serverResult.rule_id ||
        !sameExposure
      ) {
        console.log(
          `Test failed for gate ${name}. Server got ${JSON.stringify(
            serverResult,
          )}, SDK got ${JSON.stringify(sdkResult)} for ${JSON.stringify(user)}`,
        );
      }

      // @ts-ignore
      expect(sdkResult.value).toEqual(serverResult.value);
      // @ts-ignore
      expect(sdkResult.rule_id).toEqual(serverResult.rule_id);
      expect(sameExposure).toBe(true);
    }

    for (const name in configs) {
      const sdkResult = statsig._instance._evaluator.getConfig(user, name);
      const serverResult = configs[name];
      const sameExposure = compareSecondaryExposures(
        // @ts-ignore
        sdkResult.secondary_exposures,
        serverResult.secondary_exposures,
      );
      if (
        // @ts-ignore
        JSON.stringify(sdkResult.json_value) !==
          JSON.stringify(serverResult.value) ||
        // @ts-ignore
        sdkResult.rule_id !== serverResult.rule_id ||
        !sameExposure
      ) {
        console.log(
          `Test failed for config ${name}. Server got ${JSON.stringify(
            serverResult,
          )}, SDK got ${JSON.stringify(sdkResult)} for ${JSON.stringify(user)}`,
        );
      }

      // @ts-ignore
      expect(sdkResult.json_value).toMatchObject(serverResult.value);
      // @ts-ignore
      expect(sdkResult.rule_id).toEqual(serverResult.rule_id);
      expect(sameExposure).toBe(true);
    }

    for (const name in layers) {
      const sdkResult = statsig._instance._evaluator.getLayer(user, name);
      const serverResult = layers[name];
      const sameExposure = compareSecondaryExposures(
        // @ts-ignore
        sdkResult.secondary_exposures,
        serverResult.secondary_exposures,
      );
      const sameUndelegatedExposure = compareSecondaryExposures(
        // @ts-ignore
        sdkResult.undelegated_secondary_exposures,
        serverResult.undelegated_secondary_exposures,
      );

      if (
        // @ts-ignore
        JSON.stringify(sdkResult.json_value) !==
          JSON.stringify(serverResult.value) ||
        // @ts-ignore
        sdkResult.rule_id !== serverResult.rule_id ||
        !sameExposure ||
        !sameUndelegatedExposure
      ) {
        console.log(
          `Test failed for layer ${name}. Server got ${JSON.stringify(
            serverResult,
          )}, SDK got ${JSON.stringify(sdkResult)} for ${JSON.stringify(user)}`,
        );
      }

      // @ts-ignore
      expect(sdkResult.json_value).toMatchObject(serverResult.value);
      // @ts-ignore
      expect(sdkResult.rule_id).toEqual(serverResult.rule_id);
      expect(sameExposure).toBe(true);
      expect(sameUndelegatedExposure).toBe(true);
    }
  });
  await Promise.all(promises);
  console.log(`Successfully completed ${totalChecks} checks for ${api}`);
}

function compareSecondaryExposures(expo1, expo2) {
  if (expo1 == null && expo2 == null) {
    return true;
  }
  if (
    !Array.isArray(expo1) ||
    !Array.isArray(expo2) ||
    expo1.length !== expo2.length
  ) {
    return false;
  }
  var obj1 = expo1.reduce(function (res, cur) {
    res[cur.gate] = cur;
    return res;
  }, {});
  var obj2 = expo2.reduce(function (res, cur) {
    res[cur.gate] = cur;
    return res;
  }, {});

  for (const gateName in obj1) {
    const gate1 = obj1[gateName];
    const gate2 = obj2[gateName];
    if (gate1.gateValue !== gate2.gateValue || gate1.ruleID !== gate2.ruleID) {
      return false;
    }
  }
  return true;
}
