import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Timeline from "./Timeline";

describe(Timeline, () => {
  it("passes accessibility with default props", async () =>
    act(async () => {
      const { container } = render(<Timeline items={["item 1", "item 2"]} />);

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));

  it("displays single timeline", async () =>
    act(async () => {
      const { container } = render(<Timeline items={["item 1"]} />);

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));

  it("returns null for no items", async () =>
    act(async () => {
      const { container } = render(<Timeline items={[]} />);

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));
});
