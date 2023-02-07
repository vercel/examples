import { clone } from './utils/core';

type ExposeLayer = (layer: Layer, key: string) => void;

/**
 * Returns the data for a Layer in the statsig console via typed get functions
 */
export default class Layer {
  public name: string;
  private _value: Record<string, unknown>;
  private _ruleID: string;
  private _logExposure: ExposeLayer | null;

  public constructor(
    layerName: string,
    value: Record<string, unknown> = {},
    ruleID: string = '',
    logExposure: ExposeLayer | null = null,
  ) {
    if (typeof layerName !== 'string' || layerName.length === 0) {
      layerName = '';
    }
    if (value == null || typeof value !== 'object') {
      value = {};
    }

    this.name = layerName;
    this._value = clone(value) ?? {};
    this._ruleID = ruleID;
    this._logExposure = logExposure;
  }

  public get<T>(
    key: string,
    defaultValue: T | null,
    typeGuard: ((value: unknown) => value is T | null) | null = null,
  ): T | null {
    if (defaultValue === undefined) {
      defaultValue = null;
    }
    const val = this._value[key];

    if (val == null) {
      return defaultValue;
    }

    const logAndReturn = (): T => {
      this._logExposure?.(this, key);
      return val as unknown as T;
    };

    if (typeGuard) {
      return typeGuard(val) ? logAndReturn() : defaultValue;
    }

    if (defaultValue == null) {
      return logAndReturn();
    }

    if (
      typeof val === typeof defaultValue &&
      Array.isArray(defaultValue) === Array.isArray(val)
    ) {
      return logAndReturn();
    }

    return defaultValue;
  }

  getValue(
    key: string,
    defaultValue?: boolean | number | string | object | Array<any> | null,
  ): unknown | null {
    if (defaultValue === undefined) {
      defaultValue = null;
    }

    if (key == null) {
      return defaultValue;
    }

    if (this._value[key] != null) {
      this._logExposure?.(this, key);
    }

    return this._value[key] ?? defaultValue;
  }

  getRuleID(): string {
    return this._ruleID;
  }
}
