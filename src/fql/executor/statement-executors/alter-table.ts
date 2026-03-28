import type {
  AlterTableAddColumnStatement,
  AlterTableDropColumnStatement,
  AlterTableStatement,
} from "@contracts/ast.js";
import type { Dataset } from "@contracts/dataset.js";
import type { ExecutionSignal } from "@executor/executor.js";

export function alterTable(
  statement: AlterTableStatement,
  dataset: Dataset,
): ExecutionSignal {
  if (statement.variant === "DropColumn") {
    return dropColumn(statement, dataset);
  } else {
    return addColumn(statement, dataset);
  }
}

function dropColumn(
  statement: AlterTableDropColumnStatement,
  dataset: Dataset,
): ExecutionSignal {
  const table = dataset.tables[statement.tableName];

  if (table === undefined) {
    return {
      type: "Error",
      message: `Table ${statement.tableName} does not exist in the database.`,
    };
  }

  if (statement.columnName === table.primaryKeyColumn) {
    return { type: "Error", message: "Cannot drop primary key column." };
  }

  delete table.columns[statement.columnName];

  for (const rowData of Object.values(table.rows)) {
    delete rowData[statement.columnName];
  }

  return {
    type: "Info",
    message: `Dropped column ${statement.columnName} from table ${statement.tableName}.`,
  };
}

function addColumn(
  statement: AlterTableAddColumnStatement,
  dataset: Dataset,
): ExecutionSignal {
  const table = dataset.tables[statement.tableName];

  if (table === undefined) {
    return {
      type: "Error",
      message: `Table ${statement.tableName} does not exist in database.`,
    };
  }

  const numberOfExistingRows = Object.keys(table.rows).length;

  if (numberOfExistingRows > 0 && !statement.column.isNullable) {
    return {
      type: "Error",
      message: "Cannot add non-nullable column to a table with existing rows.",
    };
  }

  if (numberOfExistingRows > 1 && statement.column.isUnique) {
    return {
      type: "Error",
      message:
        "Cannot add column with unique constraint if the table has more than one existing row.",
    };
  }

  table.columns[statement.column.name] = statement.column;

  for (const rowData of Object.values(table.rows)) {
    rowData[statement.column.name] = null;
  }

  return {
    type: "Info",
    message: `Added column ${statement.column.name} to table ${statement.tableName}.`,
  };
}
