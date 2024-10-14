import '@testing-library/jest-dom';

import { act } from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Card from './Card';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility with default props', async () => act(async () => {
  const { container } = render(
    <Card
      type='bottlenose-dolphin'
      id="mocked title"
      link="/mocked-link"
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));

it('Passes accessibility with optional props', async () => act(async () => {
  const { container } = render(
    <Card
      type='minke-whale'
      id="mocked title"
      subid="mocked subtitle"
      name="mocked name"
      link="/mocked-link"
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
