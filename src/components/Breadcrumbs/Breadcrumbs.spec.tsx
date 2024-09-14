import '@testing-library/jest-dom';

import { act } from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Breadcrumbs from './Breadcrumbs';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility with default props', async () => act(async () => {
  const { container } = render(
    <Breadcrumbs
      items={[{
        title: 'World',
        path: '/hello',
      }, {
        title: 'Bar',
        path: '/hello/foo',
      }]}
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));

it('Passes accessibility with optional props', async () => act(async () => {
  const { container } = render(
    <Breadcrumbs
      wide
      inline
      items={[{
        title: 'World',
        path: '/hello',
      }, {
        title: 'Bar',
        path: '/hello/foo',
      }]}
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
