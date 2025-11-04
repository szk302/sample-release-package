#!/usr/bin/env node
import { calculate } from "./calculator.js";

export function parseArgs(args: string[]): {
  a: number;
  operator: string;
  b: number;
} {
  return {
    a: Number(args[0]),
    operator: args[1],
    b: Number(args[2]),
  };
}

export function main(args: string[]): string {
  if (args[0] === "--help" || args[0] === "-h") {
    return `Usage: calculator <number1> <operator> <number2>

Examples:
  calculator 10 + 5
  calculator 20 - 8
  calculator 6 * 7
  calculator 15 / 3`;
  }
  const parsed = parseArgs(args);
  const result = calculate(parsed.a, parsed.operator, parsed.b);
  return result.toString();
}

// CLI実行時のエントリーポイント
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const result = main(process.argv.slice(2));
    console.log(result);
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}
