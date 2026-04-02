import type { Column } from "./column.js";
import { ColumnContainer } from "./column-container.js";
import { RowContainer } from "./rows-container.js";
import { IndexContainer } from "./index-container.js";
import type { FieldValue, Row } from "./row.js";
import type { UpdateFn, Predicate } from "core/rows-container.js";
import { Index } from "./index.js";

export class Table {
  private readonly columnContainer: ColumnContainer;
  private readonly rowContainer: RowContainer;
  private readonly indexContainer: IndexContainer;

  constructor(primaryKeyColumnName: string, columns: Record<string, Column>) {
    this.columnContainer = new ColumnContainer({
      primaryKeyColumnName,
      columns,
    });
    this.rowContainer = new RowContainer();
    this.indexContainer = new IndexContainer();
    this.createdIndexesForUniqueColumns(primaryKeyColumnName, columns);
  }

  createdIndexesForUniqueColumns(
    primaryKeyColumnName: string,
    columns: Record<string, Column>,
  ) {
    for (const [columnName, column] of Object.entries(columns)) {
      if (columnName !== primaryKeyColumnName && column.isUnique) {
        this.indexContainer.addIndex(columnName, new Index());
      }
    }
  }

  insertRow(row: Row) {
    this.columnContainer.addDefaultValuesForNullColumns(row);
    this.columnContainer.ensureRowMatchesSchema(row);
    this.rowContainer.addRow(
      this.columnContainer.getPrimaryKeyColumnName(),
      row,
    );
    this.indexContainer.indexRow(
      row,
      this.columnContainer.getPrimaryKeyColumnName(),
    );
  }

  deleteRows(condition: RowCondition) {
    const primaryKeys =
      this.rowContainer.getRowPrimaryKeysThatMeetCondition(condition);
  }

  ensureRowFieldsAreUnique() {}

  getIndexes() {
    return this.indexContainer.getIndexes();
  }

  updateRows(updateFn: UpdateFn, predicate: Predicate) {
    this.rowContainer.updateRows(updateFn, predicate);
  }

  getRows() {
    return this.rowContainer.getRows();
  }
}

export interface RelationalOperators {
  type: "=" | "!=";
}

export interface RowCondition {
  columnName: string;
  value: FieldValue;
  relation: RelationalOperators;
}
