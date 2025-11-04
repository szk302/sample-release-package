import { strict as assert } from "node:assert";
import { test } from "node:test";
import { main, parseArgs } from "../cli.js";

test("shouldParseValidArguments", () => {
  const result = parseArgs(["10", "+", "5"]);
  assert.deepEqual(result, { a: 10, operator: "+", b: 5 });
});

test("shouldParseDifferentArguments", () => {
  const result = parseArgs(["3", "*", "7"]);
  assert.deepEqual(result, { a: 3, operator: "*", b: 7 });
});

test("shouldCalculateFromCommandLine", () => {
  const result = main(["10", "+", "5"]);
  assert.equal(result, "15");
});

test("shouldCalculateDifferentOperation", () => {
  const result = main(["6", "*", "7"]);
  assert.equal(result, "42");
});

test("shouldShowHelpMessage", () => {
  const result = main(["--help"]);
  assert.match(result, /Usage:/);
});

test("shouldShowHelpWithShortOption", () => {
  const result = main(["-h"]);
  assert.match(result, /Usage:/);
});
