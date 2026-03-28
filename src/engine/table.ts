import { Column } from "./column.js";
import { Index } from "./index.js";
import { Row } from "./row.js";

export class Table {
  private readonly primaryKeyColumnName: string;
  private readonly columns: Record<string, Column>;
  private readonly indexes: Record<string, Index>;
  private readonly rows: Record<string | number, Row>;

  constructor(columns: Record<string, Column>, primaryKeyColumnName: string) {
    this.ensurePrimaryKeyColumnIsDefined(primaryKeyColumnName);
    this.ensurePrimaryKeyColumnIsTextOrNumber(columns[primaryKeyColumnName]!);
    this.ensureOneColumnIsDesignatedAsThePrimaryKeyColumn(
      Object.keys(columns),
      primaryKeyColumnName,
    );

    this.primaryKeyColumnName = primaryKeyColumnName;
    this.columns = columns;
    this.rows = {};
    this.indexes = this.createEmptyIndexRecord(columns, primaryKeyColumnName);
  }

  getRows() {
    return Object.values(this.rows);
  }

  getRow(primaryKey: string) {
    return this.rows[primaryKey];
  }

  insertRow(row: Row) {
    // Primary key column can only be text or number
    const primaryKey = row.getField(this.primaryKeyColumnName) as
      | string
      | number;

    // TODO: Probably move this into its own method.
    for (const [columnName, columnDetails] of Object.entries(this.columns)) {
      if (columnDetails.isUnique) {
        // Unique columns are of type or number only
        const newRowValue = row.getField(columnName) as string | number;

        const hasExistingEntry =
          this.indexes[columnName]?.hasEntry(newRowValue);

        if (hasExistingEntry) {
          throw new Error(
            `Column ${columnName} has a uniqueness constraint. A row with value ${newRowValue} already exists.`,
          );
        }
      }
    }

    if (this.rows[primaryKey]) {
      throw new Error(
        `Row with primary key ${primaryKey} already exists in the table.`,
      );
    }

    this.rows[primaryKey] = row;
  }

  deleteRows(predicate: (row: Row) => boolean) {
    for (const [primaryKey, row] of Object.entries(this.rows)) {
      if (predicate(row)) {
        delete this.rows[primaryKey];
      }
    }
  }

  updateRows(
    updateFunction: (row: Row) => Row,
    predicate: (row: Row) => boolean,
  ) {
    for (const [primaryKey, row] of Object.entries(this.rows)) {
      if (predicate(row)) {
        this.rows[primaryKey] = updateFunction(row);
      }
    }
  }

  getColumns() {
    return { ...this.columns };
  }

  createColumn(columnName: string, column: Column) {
    const existingColumn = this.columns[columnName];

    if (existingColumn) {
      throw new Error(`Column named ${columnName} already exists.`);
    }

    const existingRows = Object.values(this.rows);

    if (existingRows.length > 0) {
      if (column.isUnique) {
        throw new Error(
          `Cannot create a unique column in a table with existing rows.`,
        );
      }

      if (!column.isNullable) {
        throw new Error(
          `Cannot create a non-nullable column in table with existing rows.`,
        );
      }

      for (const existingRow of existingRows) {
        existingRow.createNewField(columnName, null);
      }
    }

    this.columns[columnName] = column;
  }

  dropColumn(columnName: string) {
    if (columnName === this.primaryKeyColumnName) {
      throw new Error("Cannot drop primary key column.");
    }

    delete this.columns[columnName];

    for (const row of Object.values(this.rows)) {
      row.deleteField(columnName);
    }
  }

  // Get indexes
  getIndexes() {
    return { ...this.indexes };
  }

  ensurePrimaryKeyColumnIsDefined(primaryKeyColumn: string) {
    if (primaryKeyColumn === "") {
      throw new Error("Primary key column is not defined.");
    }
  }

  ensurePrimaryKeyColumnIsTextOrNumber(primaryKeyColumn: Column) {
    const primaryKeyColumnIsNotTextOrNumber = !["text", "number"].includes(
      primaryKeyColumn.type,
    );

    if (primaryKeyColumnIsNotTextOrNumber) {
      throw new Error("Primary key column is not text or number.");
    }
  }

  ensureOneColumnIsDesignatedAsThePrimaryKeyColumn(
    columnNames: string[],
    primaryKeyColumnName: string,
  ) {
    for (const columnName of columnNames) {
      if (columnName === primaryKeyColumnName) {
        return;
      }
    }

    throw new Error(
      "The primary key column is not one of the defined columns of this table.",
    );
  }

  createEmptyIndexRecord(
    columns: Record<string, Column>,
    primaryKeyColumnName: string,
  ) {
    const indexes: Record<string, Index> = {};

    for (const [columnName, column] of Object.entries(columns)) {
      if (column.isUnique && primaryKeyColumnName !== columnName) {
        indexes[columnName] = new Index();
      }
    }

    return indexes;
  }
}
