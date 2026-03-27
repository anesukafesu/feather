import type { Character } from "./character.js";

export function convertRawStringToCharacterObjects(text: string): Character[] {
  return text.split("").map(convertRawCharacterToCharacterObject);
}

export function convertRawCharacterToCharacterObject(char: string): Character {
  return {
    value: char,
    type: determineCharacterType(char),
  };
}

export function determineCharacterType(
  rawCharacter: string,
): Character["type"] {
  if (isDigit(rawCharacter)) {
    return "Digit";
  }

  if (isLetter(rawCharacter)) {
    return "Letter";
  }

  if (isSymbol(rawCharacter)) {
    return "Symbol";
  }

  if (isNewline(rawCharacter)) {
    return "Newline";
  }

  if (isNonWhitespaceNewline(rawCharacter)) {
    return "NonWhitespaceNewline";
  }

  return "Other";
}

export function isDigit(character: string) {
  return /[0-9]/.test(character);
}

export function isLetter(character: string) {
  return /[A-Z][a-z]/.test(character);
}

export function isSymbol(character: string) {
  // TODO: Include all symbols
  return /[< > = ! ;]/.test(character);
}

export function isNewline(character: string) {
  return /[\n \r \r\n]/.test(character);
}

export function isNonWhitespaceNewline(character: string) {
  return /\t\f\v/.test(character);
}
