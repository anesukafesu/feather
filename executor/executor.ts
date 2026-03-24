import { ProgramAST } from "../contracts/ast";
import { DatasetDataType } from "../contracts/common";
import { Dataset } from "../contracts/dataset";
import { createTable } from "./statement-executors/create-table";
import { listTables } from "./statement-executors/list-tables";

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

function executeStatements(
  program: ProgramAST,
  dataset: Dataset,
  ioDevice: IODevice,
) {
  let executionSignal: ExecutionSignal = { type: "Null" };

  for (const statement of program.statements) {
    if (executionSignal.type !== "Null") {
      // Handle the execution signal
    }

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
  }
}
