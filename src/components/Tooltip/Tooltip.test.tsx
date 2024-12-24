import '@testing-library/jest-dom';

import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Tooltip from './Tooltip';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility with default props', async () => {
  const { container } = render(
    <Tooltip
      text="mocked tooltip"
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
