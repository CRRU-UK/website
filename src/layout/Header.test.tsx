import { render } from "@testing-library/react";
import { act } from "react";
import { expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import Header from "./Header";

vi.mock("next/router", () => ({
  useRouter: vi.fn(() => ({
    events: {
      on: vi.fn<() => void>(),
    },
  })),
}));

it("passes accessibility", async () =>
  act(async () => {
    const { container } = render(<Header />);

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  }));
