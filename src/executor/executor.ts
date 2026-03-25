import type { ProgramAST } from "@contracts/ast.js";
import type { DatasetDataType } from "@contracts/common.js";
import type { Dataset } from "@contracts/dataset.js";
import { createTable } from "./statement-executors/create-table.js";
import { listTables } from "./statement-executors/list-tables.js";

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
      case "DropTableStatement":
      case "InsertRowStatement":

      case "SelectRowsStatement":
      case "UpdateRowsStatement":
      case "DeleteRowsStatement":
    }

    if (executionSignal.type !== "Null") {
      console.log(executionSignal);
    }
  }
}
