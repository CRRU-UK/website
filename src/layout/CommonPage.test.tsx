/* eslint-disable @typescript-eslint/no-explicit-any */

import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import { act } from "react";
import { expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import CommonPage from "./CommonPage";

vi.mock("@contentful/live-preview/react", () => ({
  useContentfulInspectorMode: () => vi.fn<() => void>(),
  useContentfulLiveUpdates: vi.fn((item) => item),
}));

it("passes accessibility with default props", async () =>
  act(async () => {
    const { container } = render(
      <CommonPage
        page={{ title: "test-title", path: "/test-path" }}
        breadcrumbs={[{ title: "test-title", path: "/test-path" }]}
        data={{ image: { url: "/test-url.jpg" } } as any}
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  }));

it("passes accessibility with optional props", async () =>
  act(async () => {
    const { container } = render(
      <CommonPage
        page={{ title: "test-title", path: "/test-path" }}
        parent={{ title: "test-parent-title", path: "/test-parent-path" }}
        breadcrumbs={[{ title: "test-title", path: "/test-path" }]}
        data={{} as any}
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  }));
