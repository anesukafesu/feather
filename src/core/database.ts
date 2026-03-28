import { Table } from "./table.js";

export class Database {
  private readonly tables: Record<string, Table>;

  constructor() {
    this.tables = {};
  }

  addTable(tableName: string, table: Table) {
    const existingTable = this.tables[tableName];

    if (existingTable) {
      throw new Error(`Table with name ${tableName} already exists.`);
    }

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
