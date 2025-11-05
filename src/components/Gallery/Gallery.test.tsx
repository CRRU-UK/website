import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Gallery from "./Gallery";

describe(Gallery, () => {
  it("passes accessibility", async () =>
    act(async () => {
      const { container } = render(
        <Gallery
          images={[
            {
              url: "/foo/bar/1",
              width: 100,
              height: 200,
              alt: "mocked alt 1",
            },
            {
              url: "/foo/bar/2",
              width: 200,
              height: 300,
              alt: null,
            },
          ]}
        />,
      );

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));
});
