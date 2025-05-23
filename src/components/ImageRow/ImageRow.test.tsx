import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import ImageRow from "./ImageRow";

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it("Passes accessibility", async () => {
  const { container } = render(
    <ImageRow
      items={[
        {
          src: "/foo/bar/1",
          width: 100,
          height: 200,
          caption: "mocked caption 1",
        },
        {
          src: "/foo/bar/2",
          width: 200,
          height: 300,
          caption: "mocked caption 2",
        },
      ]}
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
