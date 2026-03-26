import type {
  Column,
  DatasetDataType,
  DatasetValueType,
} from "@contracts/common.js";

export interface ProgramAST {
  statements: Statement[];
}

type Statement =
  | CreateTableStatement
  | ListTablesStatement
  | AlterTableStatement
  | DropTableStatement
  | InsertRowStatement
  | SelectRowsStatement
  | UpdateRowsStatement
  | DeleteRowsStatement;

export interface CreateTableStatement {
  type: "CreateTableStatement";
  primaryKeyColumn: string;
  tableName: Identifier;
  columns: Record<string, Column>;
}

export interface ListTablesStatement {
  type: "ListTablesStatement";
}

export type AlterTableStatement =
  | AlterTableAddColumnStatement
  | AlterTableDropColumnStatement;

export interface AlterTableAddColumnStatement {
  type: "AlterTableStatement";
  variant: "AddColumn";
  tableName: Identifier;
  column: Column;
}

export interface AlterTableDropColumnStatement {
  type: "AlterTableStatement";
  variant: "DropColumn";
  tableName: Identifier;
  columnName: Identifier;
}

export interface DropTableStatement {
  type: "DropTableStatement";
  tableName: Identifier;
}

export interface InsertRowStatement {
  type: "InsertRowStatement";
  tableName: Identifier;
  data: Record<string, Literal>;
}

export interface Literal {
  type: DatasetDataType;
  value: string;
}

export interface SelectRowsStatement {
  type: "SelectRowsStatement";
  tableName: Identifier;
  columnNames: ColumnsSelector;
  where: WhereClause | undefined;
}

export type ColumnsSelector = "*" | Identifier[];

export interface UpdateRowsStatement {
  type: "UpdateRowsStatement";
  tableName: Identifier;
  updateOperation: UpdateOperation;
  where: WhereClause | undefined;
}

export interface DeleteRowsStatement {
  type: "DeleteRowsStatement";
  tableName: Identifier;
  where: WhereClause | undefined;
}

export interface WhereClause {
  operator: ColumnRelationalOperator;
  column: Identifier;
  value: DatasetValueType;
}

export type ColumnRelationalOperator = "=" | "!=" | ">" | "<" | ">=" | "<=";

export type UpdateOperation = SetOperation;

export interface SetOperation {
  type: "Set";
  columnName: Identifier;
  value: DatasetDataType;
}

export type Identifier = string;
