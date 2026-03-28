export interface Character {
  value: string;
  type:
    | "Digit"
    | "Letter"
    | "Symbol"
    | "Newline"
    | "NonWhitespaceNewline"
    | "Other";
}
