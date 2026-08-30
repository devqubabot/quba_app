import {
  openDatabaseAsync,
  type SQLiteDatabase,
  type SQLiteRunResult as ExpoSQLiteRunResult,
} from "expo-sqlite";

import {
  QubaSqliteDatabase,
  SqliteBindValue,
  SqliteExecutor,
  SqlitePersistenceError,
  SqliteRow,
  SqliteRunResult,
} from "./database";
import { migrateQubaDatabase } from "./migrations";

export interface ExpoSqliteConnection {
  execAsync(sql: string): Promise<void>;
  runAsync(
    sql: string,
    parameters: SqliteBindValue[],
  ): Promise<ExpoSQLiteRunResult>;
  getFirstAsync<Row>(
    sql: string,
    parameters: SqliteBindValue[],
  ): Promise<Row | null>;
  getAllAsync<Row>(sql: string, parameters: SqliteBindValue[]): Promise<Row[]>;
  closeAsync(): Promise<void>;
}

class ExpoExecutorAdapter implements SqliteExecutor {
  constructor(private readonly executor: ExpoSqliteConnection) {}

  exec(sql: string): Promise<void> {
    return this.executor.execAsync(sql);
  }

  async run(
    sql: string,
    parameters: readonly SqliteBindValue[] = [],
  ): Promise<SqliteRunResult> {
    return this.executor.runAsync(sql, [...parameters]);
  }

  getFirst<Row extends SqliteRow>(
    sql: string,
    parameters: readonly SqliteBindValue[] = [],
  ): Promise<Row | null> {
    return this.executor.getFirstAsync<Row>(sql, [...parameters]);
  }

  getAll<Row extends SqliteRow>(
    sql: string,
    parameters: readonly SqliteBindValue[] = [],
  ): Promise<readonly Row[]> {
    return this.executor.getAllAsync<Row>(sql, [...parameters]);
  }
}

export class ExpoQubaSqliteDatabase implements QubaSqliteDatabase {
  private readonly executor: ExpoExecutorAdapter;
  private queue: Promise<void> = Promise.resolve();
  private transactionActive = false;

  constructor(private readonly database: ExpoSqliteConnection) {
    this.executor = new ExpoExecutorAdapter(database);
  }

  exec(sql: string): Promise<void> {
    return this.serialize(() => this.executor.exec(sql));
  }

  run(
    sql: string,
    parameters?: readonly SqliteBindValue[],
  ): Promise<SqliteRunResult> {
    return this.serialize(() => this.executor.run(sql, parameters));
  }

  getFirst<Row extends SqliteRow>(
    sql: string,
    parameters?: readonly SqliteBindValue[],
  ): Promise<Row | null> {
    return this.serialize(() => this.executor.getFirst<Row>(sql, parameters));
  }

  getAll<Row extends SqliteRow>(
    sql: string,
    parameters?: readonly SqliteBindValue[],
  ): Promise<readonly Row[]> {
    return this.serialize(() => this.executor.getAll<Row>(sql, parameters));
  }

  async withExclusiveTransaction<Result>(
    operation: (transaction: SqliteExecutor) => Promise<Result>,
  ): Promise<Result> {
    if (this.transactionActive) {
      throw nestedTransactionError();
    }

    return this.serialize(async () => {
      this.transactionActive = true;
      try {
        await assertForeignKeysEnabled(this.executor);
        await this.executor.exec("BEGIN IMMEDIATE;");
        try {
          const result = await operation(this.executor);
          await this.executor.exec("COMMIT;");
          return result;
        } catch (error: unknown) {
          await this.executor.exec("ROLLBACK;");
          throw error;
        }
      } finally {
        this.transactionActive = false;
      }
    });
  }

  close(): Promise<void> {
    return this.serialize(() => this.database.closeAsync());
  }

  private serialize<Result>(operation: () => Promise<Result>): Promise<Result> {
    const result = this.queue.then(operation, operation);
    this.queue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }
}

export async function openQubaDatabase(
  databaseName = "quba.db",
): Promise<ExpoQubaSqliteDatabase> {
  const database = new ExpoQubaSqliteDatabase(
    (await openDatabaseAsync(databaseName)) as SQLiteDatabase,
  );
  try {
    await migrateQubaDatabase(database);
    return database;
  } catch (error: unknown) {
    await database.close();
    throw error;
  }
}

interface ForeignKeysRow extends SqliteRow {
  readonly foreign_keys: unknown;
}

async function assertForeignKeysEnabled(
  executor: SqliteExecutor,
): Promise<void> {
  const row = await executor.getFirst<ForeignKeysRow>("PRAGMA foreign_keys;");
  if (row?.foreign_keys !== 1) {
    throw new SqlitePersistenceError(
      "foreign_keys_disabled",
      "SQLite foreign-key enforcement must be enabled before a transaction starts.",
    );
  }
}

function nestedTransactionError(): SqlitePersistenceError {
  return new SqlitePersistenceError(
    "nested_transaction",
    "Nested SQLite transactions are not supported.",
  );
}
