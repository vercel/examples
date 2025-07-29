import type { Primitive, Statement, PreparedStatement } from "db0";
export declare abstract class BoundableStatement<T> implements Statement {
    _statement: T;
    constructor(rawStmt: T);
    bind(...params: Primitive[]): PreparedStatement;
    abstract all(...params: Primitive[]): Promise<unknown[]>;
    abstract run(...params: Primitive[]): Promise<{
        success: boolean;
    }>;
    abstract get(...params: Primitive[]): Promise<unknown>;
}
