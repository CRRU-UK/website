import { describe, expect, it } from "vitest";
import buildFamilyTrees from "./buildFamilyTrees";
import type { CatalogueFamilyEntry, CatalogueFamilyNode } from "./types";

const entry = (
  key: string,
  motherKey: string | null = null,
  birthYear: string | null = null,
): CatalogueFamilyEntry => ({
  birthYear,
  key,
  motherKey,
  info: { id: key, reference: null, name: null, slug: `${key}-slug` },
});

const node = (
  key: string,
  calves: Array<CatalogueFamilyNode> = [],
  birthYear: string | null = null,
): CatalogueFamilyNode => ({ ...entry(key).info, birthYear, calves });

describe(buildFamilyTrees, () => {
  it("omits entries with neither a mother nor calves", () => {
    const result = buildFamilyTrees([entry("a"), entry("b"), entry("c")]);

    expect(result).toEqual([]);
  });

  it("omits roots that have no calves", () => {
    const result = buildFamilyTrees([entry("a"), entry("b"), entry("c", "b")]);

    expect(result.map(({ id }) => id)).toEqual(["b"]);
  });

  // Numeric IDs, because the calf order falls back to comparing them numerically
  it("nests calves under their mother", () => {
    const result = buildFamilyTrees([entry("100"), entry("101", "100"), entry("102", "100")]);

    expect(result).toEqual([node("100", [node("102"), node("101")])]);
  });

  it("does not duplicate a calf as a root", () => {
    const result = buildFamilyTrees([entry("a"), entry("b", "a"), entry("c", "b")]);

    expect(result.map(({ id }) => id)).toEqual(["a"]);
  });

  it("preserves deep nesting", () => {
    const result = buildFamilyTrees([
      entry("a"),
      entry("b", "a"),
      entry("c", "b"),
      entry("d", "c"),
    ]);

    expect(result[0].calves[0].calves[0].calves[0].id).toBe("d");
  });

  it("carries the birth year through", () => {
    const result = buildFamilyTrees([entry("a"), entry("b", "a", "2015")]);

    expect(result[0].calves[0].birthYear).toBe("2015");
  });

  it("orders calves by birth year, youngest first", () => {
    const result = buildFamilyTrees([
      entry("100"),
      entry("101", "100", "2004"),
      entry("102", "100", "2019"),
      entry("103", "100", "2011"),
    ]);

    expect(result[0].calves.map(({ birthYear }) => birthYear)).toEqual(["2019", "2011", "2004"]);
  });

  it("sorts calves with an unknown birth year last, by descending ID", () => {
    const result = buildFamilyTrees([
      entry("100"),
      entry("101", "100"),
      entry("102", "100", "2004"),
      entry("103", "100"),
    ]);

    expect(result[0].calves.map(({ id }) => id)).toEqual(["102", "103", "101"]);
  });

  it("orders four-digit IDs above three-digit ones", () => {
    const result = buildFamilyTrees([entry("100"), entry("999", "100"), entry("1000", "100")]);

    expect(result[0].calves.map(({ id }) => id)).toEqual(["1000", "999"]);
  });

  it("returns the deepest trees first", () => {
    const result = buildFamilyTrees([
      entry("shallow"),
      entry("shallow-calf", "shallow"),
      entry("deep"),
      entry("deep-calf", "deep"),
      entry("deep-grandcalf", "deep-calf"),
    ]);

    expect(result.map(({ id }) => id)).toEqual(["deep", "shallow"]);
  });

  it("keeps trees of equal depth in their original order", () => {
    const result = buildFamilyTrees([
      entry("first"),
      entry("first-calf", "first"),
      entry("second"),
      entry("second-calf", "second"),
    ]);

    expect(result.map(({ id }) => id)).toEqual(["first", "second"]);
  });

  it("ignores a mother that is not in the set", () => {
    const result = buildFamilyTrees([entry("a", "missing"), entry("b", "a")]);

    expect(result.map(({ id }) => id)).toEqual(["a"]);
  });

  it("ignores an entry that is its own mother", () => {
    const result = buildFamilyTrees([entry("a", "a"), entry("b", "a")]);

    expect(result).toEqual([node("a", [node("b")])]);
  });

  it("terminates on a mother cycle", () => {
    const result = buildFamilyTrees([entry("a", "b"), entry("b", "a")]);

    expect(result).toEqual([]);
  });
});
