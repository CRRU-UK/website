import { render } from "@testing-library/react";
import { act } from "react";
import { expect, it } from "vitest";
import { axe } from "vitest-axe";

import Footer from "./Footer";

it("passes accessibility", async () =>
  act(async () => {
    const { container } = render(<Footer />);

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  }));
