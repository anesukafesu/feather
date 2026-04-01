import type { Column, ColumnType } from "./column.js";
import type { FieldValue, Row } from "./row.js";

export class ColumnContainer {
  private columns: Record<string, Column>;
  private primaryKeyColumnName: string;

  constructor(params: {
    primaryKeyColumnName: string;
    columns: Record<string, Column>;
  }) {
    this.columns = params.columns;
    this.primaryKeyColumnName = params.primaryKeyColumnName;
    this.ensurePrimaryKeyColumnExists();
    this.ensureThePrimaryKeyColumnIsOfTypeTextOrNumber();
  }

  ensurePrimaryKeyColumnExists() {
    for (const columnName of Object.keys(this.columns)) {
      if (this.primaryKeyColumnName === columnName) {
        return;
      }
    }

    throw new Error(
      `None of the provided columns are designated as the primary key column.\
      The provided columns are ${Object.keys(this.columns).join(", ")}\
      and the primary key column is ${this.primaryKeyColumnName}.`,
    );
  }

  ensureThePrimaryKeyColumnIsOfTypeTextOrNumber() {
    for (const [columnName, column] of Object.entries(this.columns)) {
      if (
        columnName === this.primaryKeyColumnName &&
        column.type !== "text" &&
        column.type !== "number"
      ) {
        throw new Error(
          "The designated primary key column is not of type text or number.\
          It must be of type text or number.",
        );
      }
    }
  }

  getPrimaryKeyColumnName() {
    return this.primaryKeyColumnName;
  }

  dropColumn(columnName: string) {
    delete this.columns[columnName];
  }

  addColumn(columnName: string, column: Column) {
    if (this.columns[columnName]) {
      throw new Error(`A column with the name ${columnName} already exists.`);
    }

    this.columns[columnName] = column;
  }

  ensureRowMatchesSchema(row: Row) {
    // Assumes we have already generated default values for columns
    // whose values the user did not provide.
    for (const [columnName, column] of Object.entries(this.columns)) {
      const value = row[columnName];

      if (value === undefined) {
        if (!column.isNullable) {
          throw new Error(`Missing required field: ${columnName}`);
        }
        continue;
      }

      if (!this.isValidType(value, column.type)) {
        throw new Error(`Invalid type for ${columnName}`);
      }
    }

    for (const key of Object.keys(row)) {
      if (!(key in this.columns)) {
        throw new Error(`Unknown field: ${key}`);
      }
    }
  }

  addDefaultValuesForNullColumns(row: Row) {
    for (const [columnName, column] of Object.entries(this.columns)) {
      if (row[columnName] === undefined && column.defaultValueStrategy) {
        row[columnName] = column.defaultValueStrategy.generate();
      }
    }
  }

  isValidType(value: FieldValue, type: ColumnType): boolean {
    switch (type) {
      case "text":
        return typeof value === "string";
      case "number":
        return typeof value === "number";
      case "boolean":
        return typeof value === "boolean";
      case "null":
        return value === null;
    }
  }
}
