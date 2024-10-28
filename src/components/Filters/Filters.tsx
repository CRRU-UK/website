import styles from './Filters.module.scss';

interface UseSearchProps {
  callback: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
  label?: string,
  defaultValue?: string,
}

const UseSearch = ({
  callback,
  label = 'Search...',
  defaultValue,
}: UseSearchProps) => (
  <input
    type="search"
    name="search"
    onInput={({ target }) => callback((target as HTMLInputElement).value)}
    placeholder={label}
    className={styles.search}
    defaultValue={defaultValue}
    autoComplete="off"
  />
);

interface DropdownProps {
  name: string,
  defaultValue?: string,
  options: Array<{
    text: string,
    value: string,
  }>,
  callback: Function, // eslint-disable-line @typescript-eslint/no-unsafe-function-type
}

const UseDropdown = ({
  name,
  defaultValue,
  options,
  callback,
}: DropdownProps) => (
  <select
    onInput={({ target }) => callback((target as HTMLSelectElement).value)}
    defaultValue={defaultValue ?? options[0].value}
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
    {search && UseSearch(search)}
  </div>
);

export default Filters;
