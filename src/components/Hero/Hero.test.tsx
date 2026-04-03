import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Hero from "./Hero";

describe(Hero, () => {
  it("passes accessibility with default props", async () =>
    act(async () => {
      const { container } = render(
        <Hero background="/test-image.jpg" subtitle="test subtitle" title="test title" />,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));

  it("passes accessibility with optional props", async () =>
    act(async () => {
      const { container } = render(<Hero plain subtitle="test subtitle" title="test title" wide />);

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));
});
