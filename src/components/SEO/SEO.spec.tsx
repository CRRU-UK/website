import '@testing-library/jest-dom';

import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import SEO from './SEO';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Renders SEO tags with default props', async () => {
  const { container } = render(
    <SEO
      page={{
        title: 'Foo',
        description: 'Bar',
        path: '/hello/world',
      }}
      images={[{
        url: 'foo.jpg',
        width: 100,
        height: 200,
        alt: 'Bar',
      }]}
      breadcrumbs={[]}
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});

it('Renders SEO tags with optional props', async () => {
  const { container } = render(
    <SEO
      page={{
        title: 'Foo',
        path: '/hello/world',
      }}
      type='article'
      images={[{
        url: 'foo.jpg',
        width: 100,
        height: 200,
        alt: 'Bar',
      }]}
      breadcrumbs={[]}
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
