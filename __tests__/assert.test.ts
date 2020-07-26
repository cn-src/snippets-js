import assert from "@/assert";
import ArgumentError from "@/ArgumentError";

test("notNull", () => {
  expect(() => assert.notNull(null)).toThrow(ArgumentError);
  expect(() => assert.notNull(null, "Null")).toThrow("Null");
});

test("notEmpty", () => {
  expect(() => assert.strNotEmpty(null)).toThrow(ArgumentError);
  expect(() => assert.strNotEmpty("")).toThrow(ArgumentError);
  expect(() => assert.strNotEmpty([])).toThrow(ArgumentError);
  expect(() => assert.strNotEmpty(null, "Empty")).toThrow("Empty");
});
