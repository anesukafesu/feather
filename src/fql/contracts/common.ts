export type DefaultValueStrategy =
  | { type: "auto_increment"; next_value: number }
  | { type: "use_random_uuid" };

export type DatasetDataType = "text" | "number" | "boolean" | "null";
export type DatasetValueType = string | number | boolean | null;

export interface Column {
  name: string;
  type: DatasetDataType;
  isUnique: boolean;
  isNullable: boolean;
  defaultValueStrategy: DefaultValueStrategy | undefined;
}
