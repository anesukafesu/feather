import { Table } from "./table.js";

export class Database {
  private readonly tables: Record<string, Table>;

  constructor() {
    this.tables = {};
  }

  createTable(tableName: string, table: Table) {
    this.tables[tableName] = table;
  }

  listTables() {
    return Object.keys(this.tables);
  }

  getTable(tableName: string) {
    return this.tables[tableName];
  }

  dropTable(tableName: string) {
    delete this.tables[tableName];
  }
}
