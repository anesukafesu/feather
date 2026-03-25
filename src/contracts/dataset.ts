import { Column, DatasetDataType } from "./common";

export interface Dataset {
  tables: Record<string, Table>;
}

export interface Table {
  primaryKeyColumn: string;
  columns: Record<string, Column>;
  indexes: Record<string, Index>;
  rows: Record<string | number, RowData>;
}

export type Index = Record<number | string, number | string>;

export type RowData = Record<string, DatasetDataType | null>;
