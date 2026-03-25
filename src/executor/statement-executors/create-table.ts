import type { CreateTableStatement } from "../../../contracts/ast";
import type { Dataset, Index, Table } from "../../../contracts/dataset";
import type { ExecutionSignal } from "../executor";

export function createTable(
  statement: CreateTableStatement,
  dataset: Dataset,
): ExecutionSignal {
  const tableName = statement.tableName;

  // Build indexes
  const indexes: Record<string, Index> = {};
  for (const [name, column] of Object.entries(statement.columns)) {
    if (column.isUnique) {
      indexes[name] = {};
    }
  }

  const table: Table = {
    primaryKeyColumn: statement.primaryKeyColumn,
    columns: structuredClone(statement.columns),
    indexes: indexes,
    rows: {},
  };

  const existingTable = dataset.tables[tableName];

  if (existingTable) {
    throw new Error(`Table with name already exists ${tableName}.`);
  }

  dataset.tables[tableName] = table;

  return {
    type: "Info",
    message: `Created table ${tableName}`,
  };
}
