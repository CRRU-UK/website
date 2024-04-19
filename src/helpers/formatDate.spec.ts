import { formatDateRelative, formatDateLong } from './formatDate';

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

describe('formatDateLong', () => {
  it('Formats date as long', () => {
    const result = formatDateLong('2023-01-01');

    expect(result).toBe('1 January 2023');
  });
});
