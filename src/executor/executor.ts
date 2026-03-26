import type { ProgramAST } from "@contracts/ast.js";
import type { Dataset } from "@contracts/dataset.js";
import { createTable } from "./statement-executors/create-table.js";
import { listTables } from "./statement-executors/list-tables.js";
import { insertRow } from "./statement-executors/insert-row.js";
import { selectRows } from "./statement-executors/select-rows.js";
import { alterTable } from "./statement-executors/alter-table.js";
import { dropTable } from "./statement-executors/drop-table.js";

export type ExecutionSignal =
  | {
      type: "Error";
      message: string;
    }
  | {
      type: "DisplayTable";
      header: string;
      table: (string | null)[][];
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

export function executeASTProgram(program: ProgramAST, dataset: Dataset) {
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
        executionSignal = alterTable(statement, dataset);
        break;
      case "DropTableStatement":
        executionSignal = dropTable(statement, dataset);
        break;
      case "InsertRowStatement":
        executionSignal = insertRow(statement, dataset);
        break;
      case "SelectRowsStatement":
        executionSignal = selectRows(statement, dataset);
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
