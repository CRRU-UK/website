import '@testing-library/jest-dom';

import { act } from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import Tree from './Tree';

beforeAll(() => {
  expect.extend(toHaveNoViolations);
});

const mockedEntryData = {
  birthYear: null,
  sex: 'Unknown',
  totalRecaptures: null,
  yearsRecaptured: null,
  totalCalves: null,
  leftDorsalFin: null,
  rightDorsalFin: null,
  otherImages: [],
  lastUpdated: 'mocked last updated',
};

const mockedMotherData = {
  id: 'mocked mother id',
  reference: 'mocked mother reference',
  name: 'mocked mother name',
  slug: 'mocked mother slug',
};

it('Passes accessibility with default props', async () => act(async () => {
  const { container } = render(
    <Tree
      // @ts-expect-error String of enum value
      type="bottlenose-dolphin"
      entry={{
        ...mockedEntryData,
        id: 'mocked id',
        reference: 'mocked reference',
        name: 'mocked name',
        slug: 'mocked slug',
      }}
      mother={mockedMotherData}
      calves={[]}
    />,
  );

  const results = await axe(container);

  expect(results).toHaveNoViolations();
}));
