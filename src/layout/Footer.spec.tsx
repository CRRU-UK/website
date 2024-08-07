import '@testing-library/jest-dom';

import { act } from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Footer from './Footer';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility', async () => act(async () => {
  const { container } = render(
    <Footer />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
