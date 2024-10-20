import styles from './Filters.module.scss';

interface UseSearchProps {
  callback: Function,
  label?: string,
}

const UseSearch = ({
  callback,
  label = 'Search...',
}: UseSearchProps) => (
  <input
    type="search"
    name="search"
    onInput={({ target }) => callback((target as HTMLInputElement).value)}
    placeholder={label}
    className={styles.search}
    autoComplete="off"
  />
);

interface DropdownProps {
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
}: DropdownProps) => (
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

interface Props {
  search?: UseSearchProps,
  dropdowns?: Array<DropdownProps>,
}

const Filters = ({
  search,
  dropdowns,
}: Props) => (
  <div className={styles.filters}>
    {dropdowns?.map((item) => UseDropdown(item))}
    {search && UseSearch({ callback: search.callback, label: search.label })}
  </div>
);

export default Filters;
