import { AlterTableStatement } from "../../../contracts/ast";
import { Column } from "../../../contracts/common";
import { Dataset } from "../../../contracts/dataset";
import { ExecutionSignal } from "../executor";

export function alterTable(statement: AlterTableStatement, dataset: Dataset) {
  if (statement.alteration.type === "DropColumn") {
    return dropColumn(
      statement.tableName,
      statement.alteration.columnName,
      dataset,
    );
  } else {
    addColumn(
      statement.tableName,
      statement.alteration.columnName,
      statement.alteration.column,
      dataset,
    );
  }
}

function dropColumn(
  tableName: string,
  columnName: string,
  dataset: Dataset,
): ExecutionSignal {
  if (columnName === dataset.tables[tableName].primaryKeyColumn) {
    return { type: "Error", message: "Cannot drop primary key column." };
  }

  delete dataset.tables[tableName].columns[columnName];

  for (const rowData of Object.values(dataset.tables[tableName].rows)) {
    delete rowData[columnName];
  }

  return { type: "Null" };
}

function addColumn(
  tableName: string,
  columnName: string,
  column: Column,
  dataset: Dataset,
) {
  const nRows = Object.keys(dataset.tables[tableName].rows).length;

  if (nRows > 0 && !column.isNullable) {
    return {
      type: "Error",
      message: "Cannot add non-nullable column to a table with existing rows.",
    };
  }

  if (nRows > 1 && column.isUnique) {
    return {
      type: "Error",
      message:
        "Cannot add column with unique constraint if the dataset has more than one row.",
    };
  }

  dataset.tables[tableName].columns[columnName] = column;

  for (const rowData of Object.values(dataset.tables[tableName].rows)) {
    rowData[columnName] = null;
  }
}
