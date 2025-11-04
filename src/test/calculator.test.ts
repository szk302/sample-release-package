import { strict as assert } from "node:assert";
import { test } from "node:test";
import { calculate } from "../calculator.js";

test("shouldAddTwoPositiveNumbers", () => {
  const result = calculate(2, "+", 3);
  assert.equal(result, 5);
});

test("shouldAddDifferentNumbers", () => {
  const result = calculate(1, "+", 1);
  assert.equal(result, 2);
});

test("shouldSubtractTwoNumbers", () => {
  const result = calculate(5, "-", 3);
  assert.equal(result, 2);
});

test("shouldMultiplyTwoNumbers", () => {
  const result = calculate(3, "*", 4);
  assert.equal(result, 12);
});

test("shouldDivideTwoNumbers", () => {
  const result = calculate(15, "/", 3);
  assert.equal(result, 5);
});

test("shouldThrowErrorOnDivisionByZero", () => {
  assert.throws(() => {
    calculate(10, "/", 0);
  }, /Division by zero is not allowed/);
});

test("shouldThrowErrorOnUnsupportedOperator", () => {
  assert.throws(() => {
    calculate(5, "%", 2);
  }, /Unsupported operator/);
});
