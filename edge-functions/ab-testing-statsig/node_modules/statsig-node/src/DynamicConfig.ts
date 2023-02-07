import { clone } from './utils/core';

/**
 * Returns the data for a DynamicConfig in the statsig console via typed get functions
 */
export default class DynamicConfig {
  public name: string;
  public value: Record<string, unknown>;
  private _ruleID: string;
  private _secondaryExposures: Record<string, unknown>[];

  public constructor(
    configName: string,
    value: Record<string, unknown> = {},
    ruleID: string = '',
    secondaryExposures: Record<string, unknown>[] = [],
  ) {
    if (typeof configName !== 'string' || configName.length === 0) {
      configName = '';
    }
    if (value == null || typeof value !== 'object') {
      value = {};
    }
    this.name = configName;
    this.value = clone(value) ?? {};
    this._ruleID = ruleID;
    this._secondaryExposures = Array.isArray(secondaryExposures)
      ? secondaryExposures
      : [];
  }

  public get<T>(
    key: string,
    defaultValue: T | null,
    typeGuard: ((value: unknown) => value is T | null) | null = null,
  ): T | null {
    if (defaultValue === undefined) {
      defaultValue = null;
    }
    // @ts-ignore
    const val = this.getValue(key, defaultValue);

    if (val == null) {
      return defaultValue;
    }

    if (typeGuard != null) {
      return typeGuard(val) ? val as T : defaultValue;
    }

    if (defaultValue == null) {
      return val as unknown as T;
    }

    if (
      typeof val === typeof defaultValue &&
      Array.isArray(defaultValue) === Array.isArray(val)
    ) {
      return val as unknown as T;
    }

    return defaultValue;
  }

  getValue(
    key: string,
    defaultValue?: boolean | number | string | object | Array<any> | null,
  ): unknown | null {
    if (key == null) {
      return this.value;
    }

    if (defaultValue === undefined) {
      defaultValue = null;
    }

    return this.value[key] ?? defaultValue;
  }

  getRuleID(): string {
    return this._ruleID;
  }

  _getSecondaryExposures(): Record<string, unknown>[] {
    return this._secondaryExposures;
  }
}
