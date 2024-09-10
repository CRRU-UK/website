import '@testing-library/jest-dom';

import { act } from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Catalogue from './Catalogue';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility with default props', async () => act(async () => {
  const { container } = render(
    <Catalogue
      title="mocked title"
      link="/mocked-link"
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));

it('Passes accessibility with optional props', async () => act(async () => {
  const { container } = render(
    <Catalogue
      title="mocked title"
      subtitle="mocked subtitle"
      link="/mocked-link"
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
