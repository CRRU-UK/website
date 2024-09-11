import { formatDateRelative, formatDateMonth } from './formatDate';

describe('formatDateRelative', () => {
  it('Formats date shorted than 2 weeks', () => {
    const result = formatDateRelative('2023-01-01', '2023-01-14');

    expect(result).toBe('13 days ago');
  });

  it('Formats date longer than 2 weeks', () => {
    const result = formatDateRelative('2023-01-01', '2023-01-15');

    expect(result).toBe('01/01/2023');
  });
});

describe('formatDateMonth', () => {
  it('Formats date as long', () => {
    const result = formatDateMonth('2023-01-01');

    expect(result).toBe('January 2023');
  });
});
