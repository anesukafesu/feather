export class Column {
  constructor(
    readonly type: ColumnType,
    readonly isUnique: boolean,
    readonly isNullable: boolean,
    readonly defaultValueStrategy?: DefaultValueStrategy,
  ) {}
}

export type ColumnType = "text" | "number" | "boolean" | "null";

export interface DefaultValueStrategy {
  name: string;
  generate: string;
}
