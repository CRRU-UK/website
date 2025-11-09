import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Card from "./Card";

describe(Card, () => {
  it("passes accessibility with default props", async () =>
    act(async () => {
      const { container } = render(
        <Card
          // @ts-expect-error String of enum value
          type="bottlenose-dolphin"
          id="mocked title"
          link="/mocked-link"
        />,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));

  it("passes accessibility with optional props", async () =>
    act(async () => {
      const { container } = render(
        <Card
          // @ts-expect-error String of enum value
          type="minke-whale"
          id="mocked title"
          reference="mocked subtitle"
          name="mocked name"
          link="/mocked-link"
        />,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));
});
