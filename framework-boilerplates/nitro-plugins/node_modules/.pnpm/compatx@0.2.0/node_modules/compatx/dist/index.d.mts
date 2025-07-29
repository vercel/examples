/**
 * Known platform names
 */
declare const platforms: readonly ["aws", "azure", "cloudflare", "deno", "firebase", "netlify", "vercel"];
/**
 * Known platform name
 */
type PlatformName = (typeof platforms)[number] | (string & {});

/**
 * Normalize the compatibility dates from input config and defaults.
 */
declare function resolveCompatibilityDates(input?: CompatibilityDateSpec | undefined, defaults?: CompatibilityDateSpec): CompatibilityDates;
/**
 * Resolve compatibility dates with environment variables as defaults.
 *
 * Environment variable name format is `COMPATIBILITY_DATE` for default and `COMPATIBILITY_DATE_<PLATFORM>` for specific platforms.
 */
declare function resolveCompatibilityDatesFromEnv(overridesInput?: CompatibilityDateSpec | undefined): CompatibilityDates;
/**
 * Format compatibility date spec to a string
 */
declare function formatCompatibilityDate(input: CompatibilityDateSpec): string;
/**
 * Format a date to a `YYYY-MM-DD` string
 *
 * @example
 *
 * ```ts
 * formatDateString(new Date("2021/01/01")) // "2021-01-01"
 * ```
 */
declare function formatDate(date: Date | string): DateString;
type Year = `${number}${number}${number}${number}`;
type Month = `${"0" | "1"}${number}`;
type Day = `${"0" | "1" | "2" | "3"}${number}`;
/**
 * Typed date string in `YYYY-MM-DD` format
 *
 * Empty string is used to represent an "unspecified" date.
 *
 * "latest" is used to represent the latest date available (date of today).
 */
type DateString = "" | "latest" | `${Year}-${Month}-${Day}`;
/**
 * Last known compatibility dates for platforms
 *
 * @example
 * {
 *  "default": "2024-01-01",
 *  "cloudflare": "2024-03-01",
 * }
 */
type CompatibilityDates = {
    /**
     * Default compatibility date for all unspecified platforms (required)
     */
    default: DateString;
} & Partial<Record<PlatformName, DateString>>;
/**
 * Last known compatibility date for the used platform
 */
type CompatibilityDateSpec = DateString | Partial<CompatibilityDates>;

/**
 * Get compatibility updates applicable for the user given platform and date range.
 */
declare function getCompatibilityUpdates(allUpdates: CompatibilityUpdates, compatibilityDate: CompatibilityDateSpec): CompatibilityUpdates;
/**
 * Get compatibility changes between two dates.
 */
declare function getCompatibilityChanges(allUpdates: CompatibilityUpdates, compatibilityDate1: CompatibilityDateSpec, compatibilityDate2: CompatibilityDateSpec): {
    added: CompatibilityUpdates;
    removed: CompatibilityUpdates;
};
/**
 * Compatibility updateinformation.
 */
interface CompatibilityUpdate {
    /** Applicable platform name */
    platform: PlatformName;
    /** Description */
    description: string;
    /** URL for more information */
    url?: string;
    /** The starting date of updatebeing effective */
    from?: DateString;
    /** The ending date until the updateis effective */
    until?: DateString;
}
type CompatibilityUpdates = CompatibilityUpdate[];

export { formatCompatibilityDate, formatDate, getCompatibilityChanges, getCompatibilityUpdates, platforms, resolveCompatibilityDates, resolveCompatibilityDatesFromEnv };
export type { CompatibilityDateSpec, CompatibilityDates, CompatibilityUpdate, CompatibilityUpdates, DateString, PlatformName };
