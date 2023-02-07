export class ConfigSpec {
  public name: string;
  public type: string;
  public salt: string;
  public defaultValue: unknown;
  public enabled: boolean;
  public idType: string;
  public rules: ConfigRule[];
  public entity: string;
  public explicitParameters: string[] | null;
  public hasSharedParams: boolean;
  public isActive?: boolean;

  constructor(specJSON: Record<string, unknown>) {
    this.name = specJSON.name as string;
    this.type = specJSON.type as string;
    this.salt = specJSON.salt as string;
    this.defaultValue = specJSON.defaultValue;
    this.enabled = specJSON.enabled as boolean;
    this.idType = specJSON.idType as string;
    this.rules = this.parseRules(specJSON.rules);
    this.entity = specJSON.entity as string;
    this.explicitParameters = specJSON.explicitParameters as string[];
    if (specJSON.isActive !== null) {
      this.isActive = specJSON.isActive as boolean;
    }
    this.hasSharedParams =
      specJSON.hasSharedParams != null
        ? specJSON.hasSharedParams === true
        : false;
  }

  parseRules(rulesJSON: unknown) {
    const json = rulesJSON as Record<string, unknown>[];
    var rules = [];
    for (let i = 0; i < json.length; i++) {
      let rule = new ConfigRule(json[i]);
      rules.push(rule);
    }
    return rules;
  }
}

export class ConfigRule {
  public name: string;
  public passPercentage: number;
  public conditions: ConfigCondition[];
  public returnValue: unknown;
  public id: string;
  public salt: string;
  public idType: string;
  public configDelegate: string | null;
  public isExperimentGroup?: boolean;

  constructor(ruleJSON: Record<string, unknown>) {
    this.name = ruleJSON.name as string;
    this.passPercentage = ruleJSON.passPercentage as number;
    this.conditions = this.parseConditions(ruleJSON.conditions);
    this.returnValue = ruleJSON.returnValue;
    this.id = ruleJSON.id as string;
    this.salt = ruleJSON.salt as string;
    this.idType = ruleJSON.idType as string;
    this.configDelegate = (ruleJSON.configDelegate as string) ?? null;

    if (ruleJSON.isExperimentGroup !== null) {
      this.isExperimentGroup = ruleJSON.isExperimentGroup as boolean;
    }
  }

  parseConditions(conditionsJSON: unknown) {
    const json = conditionsJSON as Record<string, unknown>[];
    var conditions: ConfigCondition[] = [];
    json?.forEach((cJSON) => {
      let condition = new ConfigCondition(cJSON);
      conditions.push(condition);
    });
    return conditions;
  }
}

export class ConfigCondition {
  public type: string;
  public targetValue: unknown;
  public operator: string;
  public field: string;
  public additionalValues: Record<string, unknown>;
  public idType: string;
  public constructor(conditionJSON: Record<string, unknown>) {
    this.type = conditionJSON.type as string;
    this.targetValue = conditionJSON.targetValue;
    this.operator = conditionJSON.operator as string;
    this.field = conditionJSON.field as string;
    this.additionalValues =
      (conditionJSON.additionalValues as Record<string, unknown>) ?? {};
    this.idType = conditionJSON.idType as string;
  }
}
