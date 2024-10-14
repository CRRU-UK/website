import '@testing-library/jest-dom';

import { act } from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Toolbar from './Toolbar';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility with default props', async () => act(async () => {
  const { container } = render(
    <Toolbar type='bottlenose-dolphin' />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
