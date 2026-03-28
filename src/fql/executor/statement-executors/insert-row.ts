import type { InsertRowStatement, Literal } from "@contracts/ast.js";
import type { Column } from "@contracts/common.js";
import type { Dataset } from "@contracts/dataset.js";
import type { ExecutionSignal } from "@executor/executor.js";
import { v4 as uuid } from "uuid";

export function insertRow(
  statement: InsertRowStatement,
  dataset: Dataset,
): ExecutionSignal {
  const tableName = statement.tableName;
  const inputRow = structuredClone(statement.data);
  const table = dataset.tables[tableName];

  if (table === undefined) {
    return { type: "Error", message: `Table '${tableName}' does not exist.` };
  }

  const row: Record<string, string | null> = {};

  for (const [_, column] of Object.entries(table.columns)) {
    const inputValue = inputRow[column.name];

    try {
      const value = resolveValueForColumn(inputValue, column);
      row[column.name] = value;
      delete inputRow[column.name];
    } catch (e) {
      if (e instanceof Error) {
        return { type: "Error", message: e.message };
      }
    }
  }

  if (Object.keys(inputRow).length > 0) {
    return {
      type: "Error",
      message: `The insert statement provides more fields than table columns. The extra fields are: ${Object.keys(inputRow).join(", ")}.`,
    };
  }

  const primaryKey = row[table.primaryKeyColumn]!;
  table.rows[primaryKey] = row;

  // Index all the table's indexed columns
  for (const indexColumnName of Object.keys(table.indexes)) {
    // If value is null, we know that the column is not unique,
    // Therefore does not have an index.
    const value = row[indexColumnName] as string;

    const existingValue = table.indexes[indexColumnName]![value];

    if (existingValue) {
      return {
        type: "Error",
        message: `A row with the value '${value}' for unique column ${indexColumnName} already exists in table ${tableName}.`,
      };
    }

    table.indexes[indexColumnName]![value] = primaryKey;
  }

  return { type: "Info", message: "Inserted row into table" };
}

/**
 * Decides what value should be added as an entry for the column.
 */
function resolveValueForColumn(
  value: Literal | undefined,
  column: Column,
): string | null {
  // Value is undefined when the user has not provided anything
  const valueIsUndefined = value === undefined;

  // Value is null when the user has provided null as the value
  const valueIsNull = value?.type === "null";

  // A user has not specified a strategy for producing default values in the absence of entries
  const columnDefaultValueStrategyIsUndefined =
    column.defaultValueStrategy === undefined;

  // Can the column be set as null
  const columnIsNullable = column.isNullable;

  const valueTypeMatchesColumnType = value?.type === column.type;

  if (valueIsUndefined) {
    if (columnDefaultValueStrategyIsUndefined) {
      if (columnIsNullable) {
        return null;
      } else {
        throw new Error(`Missing value for required column ${column.name}.`);
      }
    } else {
      if (column.defaultValueStrategy?.type === "auto_increment") {
        const value = column.defaultValueStrategy.next_value;
        column.defaultValueStrategy.next_value++;
        return value.toString();
      }

      if (column.defaultValueStrategy?.type === "use_random_uuid") {
        return uuid();
      }
    }
  } else {
    if (column.defaultValueStrategy?.type === "auto_increment") {
      throw new Error(
        `The ${column.name} column does not take in values because it uses the auto increment strategy.`,
      );
    }

    if (valueTypeMatchesColumnType) {
      return value.value;
    } else {
      if (valueIsNull && columnIsNullable) {
        return null;
      } else {
        throw new Error(
          `Column ${column.name} expects values of type ${column.type}, but instead received a value of type ${value.type}.`,
        );
      }
    }
  }

  // This should never run
  return null;
}
