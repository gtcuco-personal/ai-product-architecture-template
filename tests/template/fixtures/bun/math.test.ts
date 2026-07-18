import { expect, test } from "bun:test";

import { add } from "./src/math";

test("Bun fixture executes its test script", () => {
  expect(add(2, 3)).toBe(5);
});
