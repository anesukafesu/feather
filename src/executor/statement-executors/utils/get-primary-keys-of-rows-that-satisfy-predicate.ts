import type { Predicate } from "@contracts/ast.js";
import type { Column } from "@contracts/common.js";
import type { RowData } from "@contracts/dataset.js";
import { coerceValue } from "./coerce-value.js";
import { evaluateRelationalExpression } from "./evaluate-relational-expression.js";

/**
 * Gets the primary keys of rows for which the predicate is true.
 */
export function getPrimaryKeysOfRowsThatSatisfyPredicate(
  rows: Record<string, RowData>,
  columns: Record<string, Column>,
  predicate: Predicate,
) {
  const primaryKeys = [];
  const column = columns[predicate.columnName];

  if (!column) {
    throw new Error(`Column ${predicate.columnName} is not defined.`);
  }

  for (const [primaryKey, rowData] of Object.entries(rows)) {
    const rawFieldValue = rowData[predicate.columnName];

    if (rawFieldValue === undefined) {
      throw new Error(`Row is missing field: ${predicate.columnName}`);
    }

    const formattedFieldValue = coerceValue(rawFieldValue, column.type);

    if (
      evaluateRelationalExpression(
        formattedFieldValue,
        predicate.value,
        predicate.operator,
      )
    ) {
      primaryKeys.push(primaryKey);
    }
  }

  return primaryKeys;
}
