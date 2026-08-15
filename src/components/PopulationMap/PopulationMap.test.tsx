import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import type { CatalogueFamilyNode } from "@/helpers/types";

import PopulationMap from "./PopulationMap";

const node = (id: string, calves: Array<CatalogueFamilyNode> = []): CatalogueFamilyNode => ({
  id,
  reference: `mocked ${id} reference`,
  name: `mocked ${id} name`,
  slug: `mocked-${id}-slug`,
  birthYear: "2015",
  calves,
});

// Covers :only-child, an odd number of siblings, and three generations of nesting
const mockedTrees = [
  node("a", [node("b", [node("c")])]),
  node("d", [node("e"), node("f"), node("g")]),
];

// jsdom does not implement scrollIntoView, which the deep link uses to centre the map...
Element.prototype.scrollIntoView = () => {};

// ...nor showModal, which the info button uses to open the overlay
HTMLDialogElement.prototype.showModal = function showModal() {
  this.open = true;
};

/**
 * Deliberately not wrapped in `act`, unlike the other component tests in this repo.
 *
 * `render` inside an async `act` callback has not committed by the time the callback
 * body runs, so `container` is still empty and any assertion against it passes vacuously.
 */
describe(PopulationMap, () => {
  it("passes accessibility with default props", async () => {
    const { container } = render(<PopulationMap trees={mockedTrees} />);

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });

  it("marks only the deep-linked animal", () => {
    const { container } = render(<PopulationMap focusId="c" trees={mockedTrees} />);

    const selected = container.querySelectorAll("[data-selected]");

    expect(selected).toHaveLength(1);
    expect(selected[0].querySelector("a")?.getAttribute("href")).toContain("mocked-c-slug");
  });

  it("opens the overlay from the info button", () => {
    // Scoped to `container` because this file's renders are never unmounted between tests
    const { container } = render(
      <PopulationMap trees={mockedTrees}>mocked overlay content</PopulationMap>,
    );

    const dialog = container.querySelector("dialog");

    expect(dialog?.textContent).toContain("mocked overlay content");
    expect(dialog?.open).toBe(false);

    fireEvent.click(container.querySelector("[aria-label='About']") as Element);

    expect(dialog?.open).toBe(true);
  });

  it("marks nothing when the deep link matches no animal", () => {
    const { container } = render(<PopulationMap focusId="not-on-the-map" trees={mockedTrees} />);

    expect(container.querySelectorAll("[data-selected]")).toHaveLength(0);
  });
});
