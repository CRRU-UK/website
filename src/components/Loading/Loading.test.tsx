import '@testing-library/jest-dom';

import { act } from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Loading from './Loading';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility', async () => act(async () => {
  const { container } = render(
    // @ts-expect-error String of enum value
    <Loading type='bottlenose-dolphin' />
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
