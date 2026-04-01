import type { FieldValue } from "./row.js";

export interface Column {
  type: ColumnType;
  isUnique: boolean;
  isNullable: boolean;
  defaultValueStrategy?: DefaultValueStrategy;
}

export type ColumnType = "text" | "number" | "boolean" | "null";

export interface DefaultValueStrategy {
  name: string;
  generate: () => FieldValue;
}
