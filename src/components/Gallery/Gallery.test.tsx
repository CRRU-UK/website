import "@testing-library/jest-dom";

import { act } from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import Gallery from "./Gallery";

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it("Passes accessibility", async () =>
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

    expect(results).toHaveNoViolations();
  }));
