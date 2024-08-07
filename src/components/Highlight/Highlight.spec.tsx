import '@testing-library/jest-dom';

import { act } from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Highlight from './Highlight';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility with default props', async () => act(async () => {
  const { container } = render(
    <Highlight>
      <p>Hello world</p>
    </Highlight>,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));

it('Passes accessibility with optional props', async () => act(async () => {
  const { container } = render(
    <Highlight warning>
      <p>Hello world</p>
    </Highlight>,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
