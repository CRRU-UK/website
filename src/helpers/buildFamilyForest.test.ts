import { describe, expect, it } from "vitest";
import buildFamilyForest from "./buildFamilyForest";
import type { CatalogueFamilyEntry } from "./types";

const entry = (key: string, motherKey: string | null = null): CatalogueFamilyEntry => ({
  key,
  motherKey,
  info: { id: key, reference: null, name: null, slug: `${key}-slug` },
});

describe(buildFamilyForest, () => {
  it("omits entries with neither a mother nor calves", () => {
    const result = buildFamilyForest([entry("a"), entry("b"), entry("c")]);

    expect(result).toEqual([]);
  });

  it("omits roots that have no calves", () => {
    const result = buildFamilyForest([entry("a"), entry("b"), entry("c", "b")]);

    expect(result.map(({ id }) => id)).toEqual(["b"]);
  });

  it("nests calves under their mother", () => {
    const result = buildFamilyForest([entry("a"), entry("b", "a"), entry("c", "a")]);

    expect(result).toEqual([
      {
        ...entry("a").info,
        calves: [
          { ...entry("b").info, calves: [] },
          { ...entry("c").info, calves: [] },
        ],
      },
    ]);
  });

  it("does not duplicate a calf as a root", () => {
    const result = buildFamilyForest([entry("a"), entry("b", "a"), entry("c", "b")]);

    expect(result.map(({ id }) => id)).toEqual(["a"]);
  });

  it("preserves deep nesting", () => {
    const result = buildFamilyForest([
      entry("a"),
      entry("b", "a"),
      entry("c", "b"),
      entry("d", "c"),
    ]);

    expect(result[0].calves[0].calves[0].calves[0].id).toBe("d");
  });

  it("ignores a mother that is not in the set", () => {
    const result = buildFamilyForest([entry("a", "missing"), entry("b", "a")]);

    expect(result.map(({ id }) => id)).toEqual(["a"]);
  });

  it("ignores an entry that is its own mother", () => {
    const result = buildFamilyForest([entry("a", "a"), entry("b", "a")]);

    expect(result).toEqual([{ ...entry("a").info, calves: [{ ...entry("b").info, calves: [] }] }]);
  });

  it("terminates on a mother cycle", () => {
    const result = buildFamilyForest([entry("a", "b"), entry("b", "a")]);

    expect(result).toEqual([]);
  });
});
