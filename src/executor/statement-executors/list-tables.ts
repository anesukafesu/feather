import type { ListTablesStatement } from "@contracts/ast.js";
import type { DatasetDataType } from "@contracts/common.js";
import type { Dataset } from "@contracts/dataset.js";
import type { ExecutionSignal } from "@executor/executor.js";

export function listTables(
  _statement: ListTablesStatement,
  dataset: Dataset,
): ExecutionSignal {
  const tableNames = Object.keys(dataset.tables);
  const tableNamesAsRows = tableNames.map((tableName) => [tableName]);

  return {
    type: "DisplayTable",
    header: "Database Tables",
    table: tableNamesAsRows as DatasetDataType[][],
  };
}
