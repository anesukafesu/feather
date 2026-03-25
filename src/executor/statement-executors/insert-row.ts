import { InsertRowStatement } from "../../../contracts/ast";
import { Dataset } from "../../../contracts/dataset";
import { ExecutionSignal } from "../executor";

export function insertRow(
  statement: InsertRowStatement,
  dataset: Dataset,
): ExecutionSignal {}
