const { ConfigSpec } = require('../ConfigSpec');
const exampleConfigSpecs = require('./jest.setup');

describe('Verify behavior of ConfigSpec', () => {
  const gateSpec = new ConfigSpec(exampleConfigSpecs.gate);
  const dynamicConfigSpec = new ConfigSpec(exampleConfigSpecs.config);

  beforeEach(() => {});

  test('Test constructor works for feature gates', () => {
    expect(gateSpec).toBeTruthy();
    expect(gateSpec.type).toEqual('feature_gate');
    expect(gateSpec.name).toEqual('nfl_gate');
    expect(gateSpec.salt).toEqual('na');
    expect(gateSpec.enabled).toEqual(true);
    expect(gateSpec.defaultValue).toEqual(false);

    let rules = gateSpec.rules;
    expect(Array.isArray(rules)).toEqual(true);
    expect(rules.length).toEqual(1);

    let rule = rules[0];
    expect(rule.name).toEqual('employees');
    expect(rule.id).toEqual('rule_id_gate');
    expect(rule.passPercentage).toEqual(100);
    expect(rule.returnValue).toEqual(true);

    let conds = rule.conditions;
    expect(Array.isArray(conds)).toEqual(true);
    expect(conds.length).toEqual(1);

    let cond = conds[0];
    expect(cond.type).toEqual('user_field');
    expect(cond.targetValue).toEqual(['packers.com', 'nfl.com']);
    expect(cond.operator).toEqual('str_contains_any');
    expect(cond.field).toEqual('email');
  });

  test('Test constructor works for dynamic configs', () => {
    expect(dynamicConfigSpec).toBeTruthy();
    expect(dynamicConfigSpec.type).toEqual('dynamic_config');
    expect(dynamicConfigSpec.name).toEqual('teams');
    expect(dynamicConfigSpec.salt).toEqual('sodium');
    expect(dynamicConfigSpec.enabled).toEqual(true);
    expect(dynamicConfigSpec.defaultValue).toEqual({
      test: 'default',
    });

    let rules = dynamicConfigSpec.rules;
    expect(Array.isArray(rules)).toEqual(true);
    expect(rules.length).toEqual(2);

    let rule = rules[0];
    expect(rule.name).toEqual('can see teams');
    expect(rule.id).toEqual('rule_id_config');
    expect(rule.passPercentage).toEqual(100);
    expect(rule.returnValue).toEqual({
      packers: {
        name: 'Green Bay Packers',
        yearFounded: 1919,
      },
      seahawks: {
        name: 'Seattle Seahawks',
        yearFounded: 1974,
      },
    });

    let conds = rule.conditions;
    expect(Array.isArray(conds)).toEqual(true);
    expect(conds.length).toEqual(1);

    let cond = conds[0];
    expect(cond.type).toEqual('user_field');
    expect(cond.targetValue).toEqual(9);
    expect(cond.operator).toEqual('gte');
    expect(cond.field).toEqual('level');
  });
});
