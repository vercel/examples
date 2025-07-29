/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} data
* @returns {BinaryInfo}
*/
export function detect(data: Uint8Array): BinaryInfo;
/**
*/
export enum Runtime {
  Go,
  Rust,
}
/**
*/
export enum Platform {
  Win32,
  Darwin,
  Linux,
}
/**
*/
export enum Arch {
  X86,
  Amd64,
  Arm,
  Arm64,
}
/**
*/
export class BinaryInfo {
  free(): void;
/**
*/
  arch: number;
/**
*/
  platform: number;
/**
*/
  runtime?: number;
}
