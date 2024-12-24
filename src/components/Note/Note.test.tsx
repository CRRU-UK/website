import '@testing-library/jest-dom';

import { act } from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Note from './Note';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility', async () => act(async () => {
  const { container } = render(
    <Note>
      <p>Hello world</p>
    </Note>,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
