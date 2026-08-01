import type { CatalogueFamilyEntry, CatalogueFamilyNode } from "./types";

/**
 * Orders calves youngest first, matching the `-fields.id` order the individual entry page uses so
 * the 'current calf' reads first. Entries with an unknown birth year fall back to their catalogue
 * ID, which tracks birth order closely enough, and sort after those with a known year.
 */
const youngestFirst = (a: CatalogueFamilyNode, b: CatalogueFamilyNode): number => {
  if (a.birthYear !== b.birthYear) {
    if (!a.birthYear) {
      return 1;
    }

    if (!b.birthYear) {
      return -1;
    }

    return Number(b.birthYear) - Number(a.birthYear);
  }

  /**
   * Numeric so a future four-digit ID still sorts above "999"; non-numeric IDs would make the
   * subtraction NaN, which is an unstable comparator, so fall back to a string compare
   */
  const byId = Number(b.id) - Number(a.id);

  return Number.isNaN(byId) ? b.id.localeCompare(a.id) : byId;
};

/**
 * Number of generations in a tree, which is what decides its rendered height.
 * @param node Root of the tree to measure.
 * @returns Generation count, counting the root itself as one.
 */
const generations = (node: CatalogueFamilyNode): number =>
  node.calves.length === 0 ? 1 : 1 + Math.max(...node.calves.map(generations));

/**
 * Builds family trees from a flat list of catalogue entries. Only animals that are part of a family
 * are included. A root must have at least one calf, so entries with neither a mother nor calves are
 * omitted. Self-links, mothers missing from the set, and mother cycles caused by bad data are
 * dropped.
 * @param entries Catalogue entries keyed on Contentful entry ID.
 * @returns Family trees, deepest first, then in the order their roots appear in `entries`.
 */
const buildFamilyTrees = (entries: Array<CatalogueFamilyEntry>): Array<CatalogueFamilyNode> => {
  const byKey = new Map(entries.map((entry) => [entry.key, entry]));

  const calvesOf = new Map<string, Array<string>>();
  for (const { key, motherKey } of entries) {
    if (!motherKey || motherKey === key || !byKey.has(motherKey)) {
      continue;
    }

    const siblings = calvesOf.get(motherKey);
    if (siblings) {
      siblings.push(key);
    } else {
      calvesOf.set(motherKey, [key]);
    }
  }

  const calves = new Set([...calvesOf.values()].flat());

  // Shared across the whole set so a cycle can never be walked twice
  const visited = new Set<string>();

  const build = (key: string): CatalogueFamilyNode | null => {
    const entry = byKey.get(key);
    if (!entry || visited.has(key)) {
      return null;
    }

    visited.add(key);

    return {
      ...entry.info,
      birthYear: entry.birthYear,
      calves: (calvesOf.get(key) ?? [])
        .map(build)
        .filter((node): node is CatalogueFamilyNode => node !== null)
        .sort(youngestFirst),
    };
  };

  /**
   * Sorts deepest trees first, so trees of similar height share a row on the map. In a wrapping
   * flex layout, every row is as tall as its tallest item, so mixing short and tall trees causes
   * excess vertical space. Sorting is stable, so trees of equal depth keep their `id` order.
   */
  return entries
    .filter(({ key }) => !calves.has(key) && calvesOf.has(key))
    .map(({ key }) => build(key))
    .filter((node): node is CatalogueFamilyNode => node !== null)
    .sort((a, b) => generations(b) - generations(a));
};

export default buildFamilyTrees;
