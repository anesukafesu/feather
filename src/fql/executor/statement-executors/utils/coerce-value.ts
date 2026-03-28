import type { DatasetDataType } from "@contracts/common.js";

export function coerceValue(value: string | null, type: DatasetDataType) {
  if (value === null) {
    return null;
  }

  if (type === "text") {
    return value;
  }

  if (type === "number") {
    return Number(value);
  }

  if (type === "boolean") {
    if (value === "true") return true;
    if (value === "false") return false;
    throw new Error(`Invalid boolean value: ${value}`);
  }

  return null;
}
