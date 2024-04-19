import '@testing-library/jest-dom';

import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import CommonPage from './CommonPage';

jest.mock('@contentful/live-preview/react', () => ({
  useContentfulInspectorMode: () => jest.fn(),
  useContentfulLiveUpdates: jest.fn((item) => item),
}));

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

it('Passes accessibility with default props', async () => act(async () => {
  const { container } = render(
    <CommonPage
      page={{ title: 'test-title', path: '/test-path' }}
      breadcrumbs={[{ title: 'test-title', path: '/test-path' }]}
      data={{ image: { url: '/test-url.jpg' } } as any}
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));

it('Passes accessibility with optional props', async () => act(async () => {
  const { container } = render(
    <CommonPage
      page={{ title: 'test-title', path: '/test-path' }}
      parent={{ title: 'test-parent-title', path: '/test-parent-path' }}
      breadcrumbs={[{ title: 'test-title', path: '/test-path' }]}
      data={{} as any}
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
