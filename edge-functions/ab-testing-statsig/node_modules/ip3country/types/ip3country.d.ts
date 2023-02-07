export = ip3country;

declare namespace ip3country {
  /**
   * Initializes ip3country. Must be called once before any lookups.
   *
   * This is relatively CPU intensive so call it during application startup if
   * possible.
   */
  function init(): void;

  /**
   * Returns a 2-digit country code for the given IP Address.  Returns `null` if
   * there is no match.  Behaviour is unspecified for invalid IP Address strings
   * (either null or a random country will be returned).
   *
   * @param ip An IP Address in octet dot-decimal notation, e.g. "127.0.0.1".
   */
  function lookupStr(ip: string): string | null;

  /**
   * Returns a 2-digit country code for the given IP Address.  Returns `null` if
   * there is no match.
   *
   * @param ip An IP Address represented as a 32-bit unsigned integer.
   */
  function lookupNumeric(ip: number): string | null;
}
