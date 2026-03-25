import type { Column } from "@contracts/common.js";

export interface Dataset {
  tables: Record<string, Table>;
}

export interface Table {
  primaryKeyColumn: string;
  columns: Record<string, Column>;
  indexes: Record<string, Index>;
  rows: Record<string, RowData>;
}

export type Index = Record<number | string, number | string>;

export type RowData = Record<string, string | null>;
