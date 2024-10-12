import '@testing-library/jest-dom';

import { act } from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Timeline from './Timeline';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility with default props', async () => act(async () => {
  const { container } = render(
    <Timeline
      items={['item 1', 'item 2']}
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
