export type SqliteBindValue = string | number | null | boolean | Uint8Array;

export interface SqliteRunResult {
  readonly changes: number;
  readonly lastInsertRowId: number;
}

export type SqliteRow = Readonly<Record<string, unknown>>;

export interface SqliteExecutor {
  exec(sql: string): Promise<void>;
  run(
    sql: string,
    parameters?: readonly SqliteBindValue[],
  ): Promise<SqliteRunResult>;
  getFirst<Row extends SqliteRow>(
    sql: string,
    parameters?: readonly SqliteBindValue[],
  ): Promise<Row | null>;
  getAll<Row extends SqliteRow>(
    sql: string,
    parameters?: readonly SqliteBindValue[],
  ): Promise<readonly Row[]>;
}

export interface QubaSqliteDatabase extends SqliteExecutor {
  withExclusiveTransaction<Result>(
    operation: (transaction: SqliteExecutor) => Promise<Result>,
  ): Promise<Result>;
  close(): Promise<void>;
}

export type SqlitePersistenceErrorCode =
  | "database_newer_than_app"
  | "foreign_keys_disabled"
  | "invalid_database_row"
  | "missing_persisted_entity"
  | "nested_transaction";

export class SqlitePersistenceError extends Error {
  constructor(
    readonly code: SqlitePersistenceErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "SqlitePersistenceError";
  }
}
