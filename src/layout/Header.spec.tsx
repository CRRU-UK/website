import '@testing-library/jest-dom';

import { act } from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Header from './Header';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    events: {
      on: jest.fn(),
    },
  })),
}));

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility', async () => act(async () => {
  const { container } = render(
    <Header />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
