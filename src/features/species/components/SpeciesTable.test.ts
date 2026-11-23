import { expect, test } from "vitest";
import { range } from "./SpeciesTable";

test("온습도 범위는 있는 값만 잇고, 최소·최대가 같으면 하나로 쓴다", () => {
  expect(range(34, 36)).toBe("34~36");
  expect(range(30, 30)).toBe("30");
  expect(range(34)).toBe("34~");
  expect(range(undefined, 36)).toBe("~36");
  expect(range()).toBeUndefined();
});
