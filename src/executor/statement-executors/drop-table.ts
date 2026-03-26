import type { DropTableStatement } from "@contracts/ast.js";
import type { Dataset } from "@contracts/dataset.js";
import type { ExecutionSignal } from "@executor/executor.js";

export function dropTable(
  statement: DropTableStatement,
  dataset: Dataset,
): ExecutionSignal {
  delete dataset.tables[statement.tableName];

  return { type: "Info", message: `Dropped table ${statement.tableName}.` };
}
