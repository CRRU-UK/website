import '@testing-library/jest-dom';

import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Filters from './Filters';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility with default props', async () => act(async () => {
  const { container } = render(
    <Filters />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));

it('Passes accessibility with optional props', async () => act(async () => {
  const { container } = render(
    <Filters
      onSearch={jest.fn()}
      dropdowns={[{
        name: 'test name',
        options: [{
          text: 'test text 1',
          value: 'text-value-1',
        }, {
          text: 'test text 2',
          value: 'text-value-2',
        }],
        callback: jest.fn(),
      }]}
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
