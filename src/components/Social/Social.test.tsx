import { render } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import Social from "./Social";

describe(Social, () => {
  it("passes accessibility", async () =>
    act(async () => {
      const { container } = render(<Social />);

      const results = await axe(container);

      expect(results.violations).toHaveLength(0);
    }));
});
