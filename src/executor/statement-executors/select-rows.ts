import type {
  Operator,
  Identifier,
  SelectRowsStatement,
  Predicate,
} from "@contracts/ast.js";
import type {
  Column,
  DatasetDataType,
  DatasetValueType,
} from "@contracts/common.js";
import type { Dataset, RowData } from "@contracts/dataset.js";
import type { ExecutionSignal } from "@executor/executor.js";

export function selectRows(
  statement: SelectRowsStatement,
  dataset: Dataset,
): ExecutionSignal {
  const tableName = statement.tableName;
  const table = dataset.tables[tableName];

  if (!table) {
    return {
      type: "Error",
      message: `The table ${statement.tableName} does not exist`,
    };
  }

  // Filter the rows that meet the condition.
  let filteredRows = statement.where
    ? filterRows(table.rows, table.columns, statement.where)
    : table.rows;

  // Get the columns that the user requested only.
  const filteredRowsAndColumns =
    statement.columnNames === "*"
      ? filteredRows
      : filterColumns(filteredRows, statement.columnNames);

  // Format them for displaying
  const formattedFilteredRowsAndColumns = Object.values(
    filteredRowsAndColumns,
  ).map((rowData: RowData) => Object.values(rowData));

  return {
    type: "DisplayTable",
    header: tableName,
    table: formattedFilteredRowsAndColumns,
  };
}

function filterColumns(
  rows: Record<string, RowData>,
  columnNames: Identifier[],
) {
  const rowsWithSelectedColumns: Record<string, RowData> = {};
  const columnNamesLookup = new Set(columnNames);

  for (const [primaryKey, rowData] of Object.entries(rows)) {
    const filteredRow: RowData = {};

    for (const [columnName, value] of Object.entries(rowData)) {
      if (columnNamesLookup.has(columnName)) {
        filteredRow[columnName] = value;
      }
    }

    rowsWithSelectedColumns[primaryKey] = filteredRow;
  }

  return rowsWithSelectedColumns;
}

/**
 * Filters rows based on whether they satisfy the where clause.
 */
function filterRows(
  rows: Record<string, RowData>,
  columns: Record<string, Column>,
  where: Predicate,
) {
  const filteredRows: Record<string, RowData> = {};
  const column = columns[where.columnName];

  if (!column) {
    throw new Error(`Column ${where.columnName} is not defined.`);
  }

  for (const [primaryKey, rowData] of Object.entries(rows)) {
    const rawFieldValue = rowData[where.columnName];

    if (rawFieldValue === undefined) {
      throw new Error(`Row is missing field: ${where.columnName}`);
    }

    const formattedFieldValue = getJsValueFromDataset(
      rawFieldValue,
      column.type,
    );

    if (evaluateExpression(formattedFieldValue, where.value, where.operator)) {
      filteredRows[primaryKey] = rowData;
    }
  }

  return filteredRows;
}

function getJsValueFromDataset(value: string | null, type: DatasetDataType) {
  if (value === null) {
    return null;
  }

  if (type === "text") {
    return value;
  }

  if (type === "number") {
    return Number(value);
  }

  if (type === "boolean") {
    if (value === "true") return true;
    if (value === "false") return false;
    throw new Error(`Invalid boolean value: ${value}`);
  }

  return null;
}

function evaluateExpression(
  left: DatasetValueType,
  right: DatasetValueType,
  operator: Operator,
): boolean {
  switch (operator) {
    case "=": {
      return left === right;
    }

    case "!=": {
      return left !== right;
    }

    case "<": {
      ensureOperandsAreNotNull(left, right, operator);
      return left! < right!;
    }

    case ">": {
      ensureOperandsAreNotNull(left, right, operator);
      return left! > right!;
    }

    case "<=": {
      ensureOperandsAreNotNull(left, right, operator);
      return left! <= right!;
    }

    case ">=": {
      ensureOperandsAreNotNull(left, right, operator);
      return left! >= right!;
    }
  }
}

function ensureOperandsAreNotNull(left: any, right: any, operator: string) {
  if (left === null) {
    throw new Error(`Left-hand side of '${operator}' operator is null.`);
  }

  if (right === null) {
    throw new Error(`Right hand side of '${operator}' operator is null.`);
  }
}
