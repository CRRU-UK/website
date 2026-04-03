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
          link="/mocked-link"
          title="mocked title"
          // @ts-expect-error String of enum value
          type="bottlenose-dolphin"
        />,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));

  it("passes accessibility with optional props", async () =>
    act(async () => {
      const { container } = render(
        <Card
          link="/mocked-link"
          name="mocked name"
          reference="mocked subtitle"
          title="mocked title"
          // @ts-expect-error String of enum value
          type="minke-whale"
        />,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));
});
