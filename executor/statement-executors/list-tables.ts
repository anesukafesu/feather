import { ListTablesStatement } from "../../contracts/ast";
import { DatasetDataType } from "../../contracts/common";
import { Dataset } from "../../contracts/dataset";
import { ExecutionSignal } from "../executor";

export function listTables(
  _statement: ListTablesStatement,
  dataset: Dataset,
): ExecutionSignal {
  const tableNames = Object.keys(dataset.tables);
  const tableNamesAsRows = tableNames.map((tableName) => [tableName]);

  return {
    type: "DisplayTable",
    header: "Database Tables",
    table: tableNamesAsRows as DatasetDataType[][],
  };
}
