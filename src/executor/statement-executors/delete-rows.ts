import type { DeleteRowsStatement } from "@contracts/ast.js";
import type { Dataset } from "@contracts/dataset.js";
import type { ExecutionSignal } from "@executor/executor.js";
import { getPrimaryKeysOfRowsThatSatisfyPredicate } from "./utils/get-primary-keys-of-rows-that-satisfy-predicate.js";

export function deleteRows(
  statement: DeleteRowsStatement,
  dataset: Dataset,
): ExecutionSignal {
  const table = dataset.tables[statement.tableName];

  if (table === undefined) {
    return {
      type: "Error",
      message: `The table ${statement.tableName} does not exist in the database.`,
    };
  }

  const primaryKeysOfRowsThatSatisfyThePredicate = statement.where
    ? getPrimaryKeysOfRowsThatSatisfyPredicate(
        table.rows,
        table.columns,
        statement.where,
      )
    : Object.keys(table.rows);

  for (const primaryKey of primaryKeysOfRowsThatSatisfyThePredicate) {
    delete table.rows[primaryKey];
  }

  const numberOfRowsDeleted = primaryKeysOfRowsThatSatisfyThePredicate.length;

  return {
    type: "Info",
    message: `Deleted ${numberOfRowsDeleted} ${numberOfRowsDeleted === 1 ? "row" : "rows"} from ${statement.tableName}.`,
  };
}
