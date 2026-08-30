import { DatabaseSync, StatementSync } from "node:sqlite";

import {
  QubaSqliteDatabase,
  SqliteBindValue,
  SqliteExecutor,
  SqlitePersistenceError,
  SqliteRow,
  SqliteRunResult,
} from "../database";

export class NodeQubaSqliteDatabase implements QubaSqliteDatabase {
  private readonly database: DatabaseSync;
  private closed = false;
  private transactionActive = false;

  constructor(filename = ":memory:") {
    this.database = new DatabaseSync(filename);
  }

  async exec(sql: string): Promise<void> {
    this.assertOpen();
    this.database.exec(sql);
  }

  async run(
    sql: string,
    parameters: readonly SqliteBindValue[] = [],
  ): Promise<SqliteRunResult> {
    this.assertOpen();
    return runStatement(this.database.prepare(sql), parameters);
  }

  async getFirst<Row extends SqliteRow>(
    sql: string,
    parameters: readonly SqliteBindValue[] = [],
  ): Promise<Row | null> {
    this.assertOpen();
    const row = this.database.prepare(sql).get(...normalize(parameters));
    return row === undefined ? null : (row as Row);
  }

  async getAll<Row extends SqliteRow>(
    sql: string,
    parameters: readonly SqliteBindValue[] = [],
  ): Promise<readonly Row[]> {
    this.assertOpen();
    return this.database.prepare(sql).all(...normalize(parameters)) as Row[];
  }

  async withExclusiveTransaction<Result>(
    operation: (transaction: SqliteExecutor) => Promise<Result>,
  ): Promise<Result> {
    this.assertOpen();
    if (this.transactionActive) {
      throw new SqlitePersistenceError(
        "nested_transaction",
        "Nested SQLite transactions are not supported.",
      );
    }

    this.database.exec("BEGIN IMMEDIATE;");
    this.transactionActive = true;
    try {
      const result = await operation(this);
      this.database.exec("COMMIT;");
      return result;
    } catch (error: unknown) {
      this.database.exec("ROLLBACK;");
      throw error;
    } finally {
      this.transactionActive = false;
    }
  }

  async close(): Promise<void> {
    if (!this.closed) {
      this.database.close();
      this.closed = true;
    }
  }

  private assertOpen(): void {
    if (this.closed) {
      throw new Error("SQLite database is closed.");
    }
  }
}

function runStatement(
  statement: StatementSync,
  parameters: readonly SqliteBindValue[],
): SqliteRunResult {
  const result = statement.run(...normalize(parameters));
  return {
    changes: Number(result.changes),
    lastInsertRowId: Number(result.lastInsertRowid),
  };
}

function normalize(
  parameters: readonly SqliteBindValue[],
): readonly (string | number | null | Uint8Array)[] {
  return parameters.map((value) =>
    typeof value === "boolean" ? (value ? 1 : 0) : value,
  );
}
