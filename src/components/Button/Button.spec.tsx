import '@testing-library/jest-dom';

import { act } from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Button from './Button';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility with default props', async () => act(async () => {
  const { container } = render(
    <Button
      text="test text"
      link="/test-link"
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));

it('Passes accessibility with optional props', async () => act(async () => {
  const { container } = render(
    <Button
      text="test text"
      link="/test-link"
      external
      inline
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
