import "@testing-library/jest-dom";

import { act } from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import Social from "./Social";

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it("Passes accessibility", async () =>
  act(async () => {
    const { container } = render(<Social />);

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  }));
