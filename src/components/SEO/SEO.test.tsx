import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import SEO from "./SEO";

describe(SEO, () => {
  it("renders SEO tags with default props", async () => {
    const { container } = render(
      <SEO
        page={{
          title: "Foo",
          description: "Bar",
          path: "/hello/world",
        }}
        images={[
          {
            url: "foo.jpg",
            width: 100,
            height: 200,
            alt: "Bar",
          },
        ]}
        breadcrumbs={[]}
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });

  it("renders SEO tags with optional props", async () => {
    const { container } = render(
      <SEO
        page={{
          title: "Foo",
          path: "/hello/world",
        }}
        type="article"
        images={[
          {
            url: "foo.jpg",
            width: 100,
            height: 200,
            alt: "Bar",
          },
        ]}
        breadcrumbs={[]}
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
