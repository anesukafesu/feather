import { Column, DatasetDataType } from "./common";

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

export interface AlterTableStatement {
  type: "AlterTableStatement";
  tableName: Identifier;
  alteration: TableAlteration;
}

export interface DropTableStatement {
  type: "DropTableStatement";
  tableName: Identifier;
}

export interface InsertRowStatement {
  type: "InsertRowStatement";
  tableName: Identifier;
  columnNames: Identifier[];
  values: DatasetDataType[];
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

export type TableAlteration = AddColumnAlteration | DropColumnAlteration;

export interface WhereClause {
  operator: ColumnRelationalOperator;
  column: Identifier;
  value: DatasetDataType;
}

export type ColumnRelationalOperator = "=" | "!=" | ">" | "<" | ">=" | "<=";

export type UpdateOperation = SetOperation;

export interface SetOperation {
  type: "Set";
  columnName: Identifier;
  value: DatasetDataType;
}

export interface AddColumnAlteration {
  type: "AddColumn";
  column: Column;
}

export interface DropColumnAlteration {
  type: "DeleteColumn";
  columnName: Identifier;
}

export type Identifier = string;
