export type DefaultValueStrategy =
  | { type: "auto_increment"; next_value: number }
  | { type: "use_random_uuid" }
  | { type: "use_custom_value"; value: string }
  | { type: "use_null" };

export type DatasetDataType = "text" | "number" | "boolean" | null;

export interface Column {
  type: DatasetDataType;
  isUnique: boolean;
  isNullable: boolean;
  defaultValueStrategy: DefaultValueStrategy | null;
}
