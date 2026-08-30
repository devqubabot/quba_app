import { DatabaseSync } from "node:sqlite";

import { SqliteBindValue, SqliteRow } from "./database";
import { ExpoQubaSqliteDatabase, ExpoSqliteConnection } from "./expoDatabase";
import { migrateQubaDatabase } from "./migrations";

jest.mock("expo-sqlite", () => ({
  openDatabaseAsync: jest.fn(),
}));

interface ForeignKeysRow extends SqliteRow {
  readonly foreign_keys: unknown;
}

interface CountRow extends SqliteRow {
  readonly count: unknown;
}

describe("Expo SQLite database adapter", () => {
  it("uses the configured connection for an immediate transaction with foreign keys enabled", async () => {
    const connection = new NodeBackedExpoConnection();
    const database = new ExpoQubaSqliteDatabase(connection);
    try {
      await migrateQubaDatabase(database);

      await expect(
        database.withExclusiveTransaction(async (transaction) => {
          const foreignKeys = await transaction.getFirst<ForeignKeysRow>(
            "PRAGMA foreign_keys;",
          );
          expect(foreignKeys?.foreign_keys).toBe(1);
          await transaction.run(
            `INSERT INTO activity_runs (
               id, activity_type, title, target_value, current_value, status,
               link_mode, habit_id, occurrence_id, started_at, completed_at
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              "orphan-run",
              "counter",
              "Orphan",
              1,
              0,
              "active",
              "linked",
              "missing-habit",
              "missing-occurrence",
              null,
              null,
            ],
          );
        }),
      ).rejects.toThrow();

      const count = await database.getFirst<CountRow>(
        "SELECT COUNT(*) AS count FROM activity_runs;",
      );
      expect(count?.count).toBe(0);
      expect(connection.transactionStatements).toEqual(
        expect.arrayContaining(["BEGIN IMMEDIATE;", "ROLLBACK;"]),
      );
    } finally {
      await database.close();
    }
  });

  it("refuses to begin when foreign-key enforcement is disabled", async () => {
    const connection = new NodeBackedExpoConnection(false);
    const database = new ExpoQubaSqliteDatabase(connection);
    const operation = jest.fn(async () => undefined);
    try {
      await expect(
        database.withExclusiveTransaction(operation),
      ).rejects.toMatchObject({
        name: "SqlitePersistenceError",
        code: "foreign_keys_disabled",
      });
      expect(operation).not.toHaveBeenCalled();
      expect(connection.transactionStatements).toEqual([]);
    } finally {
      await database.close();
    }
  });

  it("rejects a nested transaction without waiting on its own queue", async () => {
    const connection = new NodeBackedExpoConnection();
    const database = new ExpoQubaSqliteDatabase(connection);
    try {
      await expect(
        database.withExclusiveTransaction(() =>
          database.withExclusiveTransaction(async () => undefined),
        ),
      ).rejects.toMatchObject({
        name: "SqlitePersistenceError",
        code: "nested_transaction",
      });
      expect(connection.transactionStatements).toEqual([
        "BEGIN IMMEDIATE;",
        "ROLLBACK;",
      ]);
    } finally {
      await database.close();
    }
  });
});

class NodeBackedExpoConnection implements ExpoSqliteConnection {
  private readonly database = new DatabaseSync(":memory:");
  readonly transactionStatements: string[] = [];

  constructor(foreignKeysEnabled = true) {
    this.database.exec(
      `PRAGMA foreign_keys = ${foreignKeysEnabled ? "ON" : "OFF"};`,
    );
  }

  async execAsync(sql: string): Promise<void> {
    const normalizedSql = sql.trim();
    if (
      normalizedSql === "BEGIN IMMEDIATE;" ||
      normalizedSql === "COMMIT;" ||
      normalizedSql === "ROLLBACK;"
    ) {
      this.transactionStatements.push(normalizedSql);
    }
    this.database.exec(sql);
  }

  async runAsync(
    sql: string,
    parameters: SqliteBindValue[],
  ): Promise<{ readonly changes: number; readonly lastInsertRowId: number }> {
    const result = this.database.prepare(sql).run(...normalize(parameters));
    return {
      changes: Number(result.changes),
      lastInsertRowId: Number(result.lastInsertRowid),
    };
  }

  async getFirstAsync<Row>(
    sql: string,
    parameters: SqliteBindValue[],
  ): Promise<Row | null> {
    const row = this.database.prepare(sql).get(...normalize(parameters));
    return row === undefined ? null : (row as Row);
  }

  async getAllAsync<Row>(
    sql: string,
    parameters: SqliteBindValue[],
  ): Promise<Row[]> {
    return this.database.prepare(sql).all(...normalize(parameters)) as Row[];
  }

  async closeAsync(): Promise<void> {
    this.database.close();
  }
}

function normalize(
  parameters: readonly SqliteBindValue[],
): readonly (string | number | null | Uint8Array)[] {
  return parameters.map((value) =>
    typeof value === "boolean" ? (value ? 1 : 0) : value,
  );
}
