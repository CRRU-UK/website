import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import ImageCaption from "./ImageCaption";

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it("Passes accessibility with default props", async () => {
  const { container } = render(
    <ImageCaption src="/foo/bar" width={100} height={200} caption="mocked caption" />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});

it("Passes accessibility with optional props", async () => {
  const { container } = render(<ImageCaption src="/foo/bar" width={100} height={200} />);

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
