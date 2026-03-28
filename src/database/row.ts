export class Row {
  private readonly fields: Record<string, FieldValue>;

  constructor(fields: Record<string, FieldValue> = {}) {
    this.fields = fields;
  }

  getFields() {
    return { ...this.fields };
  }

  getField(name: string) {
    return this.fields[name];
  }

  createNewField(name: string, value: FieldValue = null) {
    if (this.fields[name]) {
      throw new Error(`Field named ${name} already exists in row.`);
    }

    this.fields[name] = value;
  }

  updateFieldValue(name: string, value: FieldValue) {
    if (!this.fields[name]) {
      throw new Error(`Field named ${name} does not exist in row.`);
    }

    this.fields[name] = value;
  }

  deleteField(fieldName: string) {
    delete this.fields[fieldName];
  }
}

export type FieldValue = string | number | boolean | null;
