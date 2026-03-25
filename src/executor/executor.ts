import type { ProgramAST } from "@contracts/ast.js";
import type { DatasetDataType } from "@contracts/common.js";
import type { Dataset } from "@contracts/dataset.js";
import { createTable } from "./statement-executors/create-table.js";
import { listTables } from "./statement-executors/list-tables.js";
import { insertRow } from "./statement-executors/insert-row.js";

export type ExecutionSignal =
  | {
      type: "Error";
      message: string;
    }
  | {
      type: "DisplayTable";
      header: string;
      table: DatasetDataType[][];
    }
  | {
      type: "Info";
      message: string;
    }
  | {
      type: "Null";
    };

export interface IODevice {
  displayTable(table: string[][], title?: string): void;
}

export function executeStatements(program: ProgramAST, dataset: Dataset) {
  let executionSignal: ExecutionSignal = { type: "Null" };

  for (const statement of program.statements) {
    switch (statement.type) {
      case "CreateTableStatement":
        executionSignal = createTable(statement, dataset);
        break;
      case "ListTablesStatement":
        executionSignal = listTables(statement, dataset);
        break;
      case "AlterTableStatement":
        break;
      case "DropTableStatement":
        break;
      case "InsertRowStatement":
        executionSignal = insertRow(statement, dataset);
        break;
      case "SelectRowsStatement":
        break;
      case "UpdateRowsStatement":
        break;
      case "DeleteRowsStatement":
        break;
    }

    if (executionSignal.type !== "Null") {
      console.log(executionSignal);
    }
  }
}
