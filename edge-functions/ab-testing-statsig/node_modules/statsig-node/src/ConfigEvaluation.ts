import { EvaluationDetails } from './EvaluationDetails';

export default class ConfigEvaluation {
  public value: boolean;
  public rule_id: string;
  public secondary_exposures: Record<string, string>[];
  public json_value: Record<string, unknown>;
  public explicit_parameters: string[] | null;
  public config_delegate: string | null;
  public fetch_from_server: boolean;
  public undelegated_secondary_exposures: Record<string, string>[] | undefined;
  public is_experiment_group: boolean;
  public evaluation_details: EvaluationDetails | undefined;

  constructor(
    value: boolean,
    rule_id = '',
    secondary_exposures: Record<string, string>[] = [],
    json_value: Record<string, unknown> | boolean = {},
    explicit_parameters: string[] | null = null,
    config_delegate: string | null = null,
    fetch_from_server = false,
  ) {
    this.value = value;
    this.rule_id = rule_id;
    if (typeof json_value === 'boolean') {
      // handle legacy gate case
      this.json_value = {};
    } else {
      this.json_value = json_value;
    }
    this.secondary_exposures = secondary_exposures;
    this.undelegated_secondary_exposures = secondary_exposures;
    this.config_delegate = config_delegate;
    this.fetch_from_server = fetch_from_server;
    this.explicit_parameters = explicit_parameters;
    this.is_experiment_group = false;
  }

  public withEvaluationDetails(
    evaulationDetails: EvaluationDetails,
  ): ConfigEvaluation {
    this.evaluation_details = evaulationDetails;
    return this;
  }

  public setIsExperimentGroup(isExperimentGroup: boolean = false) {
    this.is_experiment_group = isExperimentGroup;
  }

  public static fetchFromServer() {
    return new ConfigEvaluation(false, '', [], {}, undefined, undefined, true);
  }
}
