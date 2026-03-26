import type { Operator } from "@contracts/ast.js";
import type { DatasetValueType } from "@contracts/common.js";

export function evaluateRelationalExpression(
  left: DatasetValueType,
  right: DatasetValueType,
  operator: Operator,
): boolean {
  switch (operator) {
    case "=": {
      return left === right;
    }

    case "!=": {
      return left !== right;
    }

    case "<": {
      ensureOperandsAreNotNull(left, right, operator);
      return left! < right!;
    }

    case ">": {
      ensureOperandsAreNotNull(left, right, operator);
      return left! > right!;
    }

    case "<=": {
      ensureOperandsAreNotNull(left, right, operator);
      return left! <= right!;
    }

    case ">=": {
      ensureOperandsAreNotNull(left, right, operator);
      return left! >= right!;
    }
  }
}

export function ensureOperandsAreNotNull(
  left: any,
  right: any,
  operator: string,
) {
  if (left === null) {
    throw new Error(`Left-hand side of '${operator}' operator is null.`);
  }

  if (right === null) {
    throw new Error(`Right hand side of '${operator}' operator is null.`);
  }
}
