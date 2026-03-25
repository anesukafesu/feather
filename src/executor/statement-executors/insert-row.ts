import type { InsertRowStatement } from "@contracts/ast.js";
import type { Dataset } from "@contracts/dataset.js";
import type { ExecutionSignal } from "@executor/executor.js";

export function insertRow(
  statement: InsertRowStatement,
  dataset: Dataset,
): ExecutionSignal {}
