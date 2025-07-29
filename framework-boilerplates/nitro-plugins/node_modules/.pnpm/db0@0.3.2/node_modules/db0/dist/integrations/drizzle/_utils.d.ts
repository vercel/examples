import { AnyColumn, SelectedFieldsOrdered } from "drizzle-orm";
/** @internal */
export declare function mapResultRow<TResult>(columns: SelectedFieldsOrdered<AnyColumn>, row: unknown[], joinsNotNullableMap: Record<string, boolean> | undefined): TResult;
