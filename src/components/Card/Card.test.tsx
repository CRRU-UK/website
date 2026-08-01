import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import { Catalogues } from "@/helpers/constants";

import Card from "./Card";

const mockedEntry = {
  id: "003",
  reference: "800",
  name: "mocked name",
  slug: "003-mocked-name",
};

describe(Card, () => {
  it("passes accessibility with default props", async () => {
    const { container } = render(
      <Card catalogue={Catalogues.BottlenoseDolphin} entry={mockedEntry} />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });

  it("passes accessibility without a name or reference", async () => {
    const { container } = render(
      <Card
        catalogue={Catalogues.MinkeWhale}
        entry={{ ...mockedEntry, name: null, reference: null }}
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });

  it("formats the entry into a catalogue link", () => {
    const { container } = render(
      <Card catalogue={Catalogues.BottlenoseDolphin} entry={mockedEntry} />,
    );

    const link = container.querySelector("a");

    expect(link?.getAttribute("href")).toBe(
      "/research/catalogues/bottlenose-dolphin/003-mocked-name",
    );
    expect(link?.textContent).toContain("#003");
    expect(link?.textContent).toContain("#800");
    expect(link?.textContent).toContain("mocked name");
  });

  it("falls back to Unnamed when the entry has no name", () => {
    const { container } = render(
      <Card catalogue={Catalogues.BottlenoseDolphin} entry={{ ...mockedEntry, name: null }} />,
    );

    expect(container.querySelector("a")?.textContent).toContain("Unnamed");
  });
});
