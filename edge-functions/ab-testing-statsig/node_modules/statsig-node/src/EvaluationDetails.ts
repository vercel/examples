import SpecStore from './SpecStore';

export type EvaluationReason =
  | 'Network'
  | 'LocalOverride'
  | 'Unrecognized'
  | 'Uninitialized'
  | 'Bootstrap'
  | 'DataAdapter';

export class EvaluationDetails {
  readonly configSyncTime: number;
  readonly initTime: number;
  readonly serverTime: number;
  readonly reason: EvaluationReason;

  private constructor(
    configSyncTime: number,
    initTime: number,
    reason: EvaluationReason,
  ) {
    this.configSyncTime = configSyncTime;
    this.initTime = initTime;
    this.reason = reason;
    this.serverTime = Date.now();
  }

  static uninitialized(): EvaluationDetails {
    return new EvaluationDetails(0, 0, 'Uninitialized');
  }

  static make(store: SpecStore, reason?: EvaluationReason) {
    return new EvaluationDetails(
      store.getLastUpdateTime(),
      store.getInitialUpdateTime(),
      reason ?? store.getInitReason(),
    );
  }
}
