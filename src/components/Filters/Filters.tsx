/* eslint-disable react/require-default-props */

import styles from './Filters.module.scss';

interface Props {
  onSearch?: Function,
  searchLabel?: string,
  dropdowns?: Array<Dropdown>,
}

const UseSearch = (
  callback: Function,
  label: string = 'Search...',
) => (
  <input
    type="search"
    name="search"
    onInput={({ target }) => callback((target as HTMLInputElement).value)}
    placeholder={label}
    className={styles.search}
    autoComplete="off"
  />
);

interface Dropdown {
  name: string,
  options: Array<{
    text: string,
    value: string,
  }>,
  callback: Function,
}

const UseDropdown = ({
  name,
  options,
  callback,
}: Dropdown) => (
  <select
    onInput={({ target }) => callback((target as HTMLSelectElement).value)}
    className={styles.dropdown}
    name={name}
    key={name}
  >
    {options.map((option) => (
      <option value={option.value} key={option.value}>{option.text}</option>
    ))}
  </select>
);

const Filters = ({
  onSearch,
  searchLabel,
  dropdowns,
}: Props) => (
  <div className={styles.filters}>
    {dropdowns?.map((item) => UseDropdown(item))}
    {onSearch && UseSearch(onSearch, searchLabel)}
  </div>
);

export default Filters;
