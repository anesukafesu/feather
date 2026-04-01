import type { Row } from "./row.js";

export type UpdateFn = (row: Row) => Row;
export type Predicate = (row: Row) => boolean;

export class RowContainer {
  private readonly rows: Record<string | number, Row>;

  constructor() {
    this.rows = {};
  }

  addRow(primaryKeyColumnName: string | number, row: Row) {
    const primaryKey = row[primaryKeyColumnName] as string | number;
    this.rows[primaryKey] = row;
  }

  getRows() {
    return { ...this.rows };
  }

  updateRows(updateFn: UpdateFn, predicate: Predicate) {
    for (const [primaryKey, value] of Object.entries(this.rows)) {
      if (predicate(value)) {
        this.rows[primaryKey] = updateFn(value);
      }
    }
  }

  deleteRows(predicate: Predicate) {
    for (const [primaryKey, value] of Object.entries(this.rows)) {
      if (predicate(value)) {
        delete this.rows[primaryKey];
      }
    }
  }

  deleteFieldFromAllRows(fieldName: string) {
    for (const row of Object.values(this.rows)) {
      delete row[fieldName];
    }
  }
}
