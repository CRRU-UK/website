import type { CatalogueFamilyEntry, CatalogueFamilyNode } from "./types";

/**
 * Builds a forest of family trees from a flat list of catalogue entries. Only animals that are part
 * of a family are included. A root must have at least one calf, so entries with neither a mother
 * nor calves are omitted. Self-links, mothers missing from the set, and mother cycles caused by bad
 * data are dropped.
 * @param entries Catalogue entries keyed on Contentful entry ID.
 * @returns Family trees, in the order their roots appear in `entries`.
 */
const buildFamilyForest = (entries: Array<CatalogueFamilyEntry>): Array<CatalogueFamilyNode> => {
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

  // Shared across the whole forest so a cycle can never be walked twice
  const visited = new Set<string>();

  const build = (key: string): CatalogueFamilyNode | null => {
    const entry = byKey.get(key);
    if (!entry || visited.has(key)) {
      return null;
    }

    visited.add(key);

    return {
      ...entry.info,
      calves: (calvesOf.get(key) ?? [])
        .map(build)
        .filter((node): node is CatalogueFamilyNode => node !== null),
    };
  };

  return entries
    .filter(({ key }) => !calves.has(key) && calvesOf.has(key))
    .map(({ key }) => build(key))
    .filter((node): node is CatalogueFamilyNode => node !== null);
};

export default buildFamilyForest;
