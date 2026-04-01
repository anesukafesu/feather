import { Index } from "./index.js";
import type { Row } from "./row.js";

export class IndexContainer {
  private indexes: Record<string, Index>;

  constructor() {
    this.indexes = {};
  }

  getIndexes() {
    return this.indexes;
  }

  addIndex(name: string, index: Index) {
    this.indexes[name] = index;
  }

  indexRow(row: Row, primaryKeyColumnName: string) {
    for (const [name, index] of Object.entries(this.indexes)) {
      if (name in row) {
        const indexValue = row[name] as string | number;
        const rowPrimaryKey = row[primaryKeyColumnName] as string | number;

        index.createEntry(indexValue, rowPrimaryKey);
      }
    }
  }

  deleteIndex(name: string) {
    delete this.indexes[name];
  }
}
