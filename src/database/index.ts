export class Index {
  // We can only index text and number columns.
  // And the primary key column can only be a text or number column.
  private readonly entries: Record<string | number, string | number>;

  constructor() {
    this.entries = {};
  }

  getEntries() {
    return { ...this.entries };
  }

  getEntry(value: string | number) {
    return this.entries[value];
  }

  hasEntry(value: string | number) {
    return !!this.entries[value];
  }

  createEntry(indexedValue: string | number, primaryKeyValue: string | number) {
    this.entries[indexedValue] = primaryKeyValue;
  }

  removeEntry(indexedValue: string | number) {
    delete this.entries[indexedValue];
  }
}
