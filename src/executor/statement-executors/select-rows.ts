import type {
  ColumnRelationalOperator,
  Identifier,
  SelectRowsStatement,
  WhereClause,
} from "@contracts/ast.js";
import type { DatasetDataType } from "@contracts/common.js";
import type { Dataset, RowData } from "@contracts/dataset.js";
import type { ExecutionSignal } from "@executor/executor.js";

export function selectRows(
  statement: SelectRowsStatement,
  dataset: Dataset,
): ExecutionSignal {
  const tableName = statement.tableName;
  const table = dataset.tables[tableName];

  // Filter the rows that meet the condition.
  let filteredRows = statement.where
    ? filterRows(table.rows, statement.where)
    : table.rows;

  // Get the columns that the user requested only.
  const filteredRowsAndColumns =
    statement.columnNames === "*"
      ? filterRows
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
  const rowsWithSelectedColumns: Record<string | number, RowData> = {};
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

function filterRows(rows: Record<string, RowData>, where: WhereClause) {
  const filteredRows: Record<string, RowData> = {};

  for (const [primaryKey, rowData] of Object.entries(rows)) {
    if (
      evaluateExpression(rowData[where.column], where.value, where.operator)
    ) {
      filteredRows[primaryKey] = rowData;
    }
  }

  return filteredRows;
}

function evaluateExpression(
  left: DatasetDataType,
  right: DatasetDataType,
  operator: ColumnRelationalOperator,
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
