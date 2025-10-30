import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import News from "./News";

describe(News, () => {
  it("passes accessibility with default props", async () =>
    act(async () => {
      const { container } = render(
        <News
          image={{
            src: "/test-image.jpg",
            width: 100,
            height: 200,
            alt: "test alt",
          }}
          link="/test-link"
          title="test title"
        />,
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    }));

  it("passes accessibility with optional props", async () =>
    act(async () => {
      const { container } = render(
        <News
          image={{
            src: "//example.com/test-image.jpg",
            width: 100,
            height: 200,
            alt: "test alt",
          }}
          link="/test-link"
          title="test title"
          date="2022-01-01"
          category="test category"
        />,
      );

      const results = await axe(container);

      expect(results).toHaveNoViolations();
    }));
});
