export function calculate(a: number, operator: string, b: number): number {
  if (operator === "+") {
    return a + b;
  }
  if (operator === "-") {
    return a - b;
  }
  if (operator === "*") {
    return a * b;
  }
  if (operator === "/") {
    if (b === 0) {
      throw new Error("Division by zero is not allowed");
    }
    return a / b;
  }
  throw new Error("Unsupported operator");
}
