import type { FieldValue, Row } from "./row.js";
import type { RelationalOperators, RowCondition } from "./table.js";

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

  deleteRows(primaryKeys: string | number[]) {
    for (const primaryKey of primaryKeys) {
      delete this.rows[primaryKey];
    }
  }

  getRowPrimaryKeysThatMeetCondition(condition: RowCondition) {
    const primaryKeys = [];

    for (const [primaryKey, row] of Object.entries(this.rows)) {
      if (this.rowSatisfiesCondition(row, condition)) {
        primaryKeys.push(primaryKey as string | number);
      }
    }

    return primaryKeys;
  }

  rowSatisfiesCondition(row: Row, condition: RowCondition) {
    return this.applyOperator(
      row[condition.columnName] ?? null,
      condition.value,
      condition.relation,
    );
  }

  applyOperator(a: FieldValue, b: FieldValue, operator: RelationalOperators) {
    switch (operator.type) {
      case "=":
        return a === b;
      case "!=":
        return a !== b;
    }
  }

  deleteFieldFromAllRows(fieldName: string) {
    for (const row of Object.values(this.rows)) {
      delete row[fieldName];
    }
  }
}
