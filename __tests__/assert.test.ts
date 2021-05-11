import assert from "@/assert";
import ArgumentError from "@/ArgumentError";

test("notNull", () => {
    expect(() => assert.notNullOrUndefined(null)).toThrow(ArgumentError);
    expect(() => assert.notNullOrUndefined(null, "Null")).toThrow("Null");
});

test("notEmpty", () => {
    expect(() => assert.notEmptyString(null)).toThrow(ArgumentError);
    expect(() => assert.notEmptyString("")).toThrow(ArgumentError);
    expect(() => assert.notEmptyString([])).toThrow(ArgumentError);
    expect(() => assert.notEmptyString(null, "Empty")).toThrow("Empty");
});
