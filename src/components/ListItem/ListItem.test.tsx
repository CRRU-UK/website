import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import ListItem from "./ListItem";

describe(ListItem, () => {
  it("passes accessibility", async () =>
    act(async () => {
      const { container } = render(<ListItem title="test title" />);

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));

  it("passes accessibility with optional props", async () =>
    act(async () => {
      const { container } = render(
        <ListItem
          category={{
            text: "test category",
            style: 2,
          }}
          description="test description"
          image={{
            url: "https://test-url.jpg",
            width: 100,
            height: 200,
            alt: "test alt",
          }}
          link="test link"
          title="test title"
        />,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));

  it("passes accessibility with no link and category style", async () =>
    act(async () => {
      const { container } = render(
        <ListItem
          category={{
            text: "test category",
          }}
          image={{
            url: "https://test-url.jpg",
            width: 100,
            height: 200,
            alt: "test alt",
          }}
          title="test title"
        />,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));
});
