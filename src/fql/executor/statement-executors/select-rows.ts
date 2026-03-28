import type { SelectRowsStatement } from "@contracts/ast.js";
import type { Dataset } from "@contracts/dataset.js";
import type { ExecutionSignal } from "@executor/executor.js";
import { getPrimaryKeysOfRowsThatSatisfyPredicate } from "./utils/get-primary-keys-of-rows-that-satisfy-predicate.js";

export function selectRows(
  statement: SelectRowsStatement,
  dataset: Dataset,
): ExecutionSignal {
  const tableName = statement.tableName;
  const table = dataset.tables[tableName];

  const results = [];

  if (!table) {
    return {
      type: "Error",
      message: `The table ${statement.tableName} does not exist`,
    };
  }

  // If a where clause exists, we only get the rows that satisfy the predicate.
  let primaryKeysOfRowsThatSatisfyPredicate = statement.where
    ? getPrimaryKeysOfRowsThatSatisfyPredicate(
        table.rows,
        table.columns,
        statement.where,
      )
    : Object.keys(table.rows);

  let columnNames = statement.columnNames;

  if (columnNames === "*") {
    columnNames = Object.keys(table.columns);
  }

  for (const primaryKey of primaryKeysOfRowsThatSatisfyPredicate) {
    const rowToDisplay = [];
    const row = table.rows[primaryKey]!;

    for (const columnName of columnNames) {
      rowToDisplay.push(row[columnName]!);
    }

    results.push(rowToDisplay);
  }

  return {
    type: "DisplayTable",
    header: tableName,
    table: results,
  };
}
