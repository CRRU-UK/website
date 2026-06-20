import styles from "./Filters.module.scss";

interface UseSearchProps {
  callback: (value: string) => void;
  defaultValue?: string;
  label?: string;
}

const UseSearch = ({ callback, label = "Search...", defaultValue }: UseSearchProps) => (
  <input
    autoComplete="off"
    className={styles.search}
    defaultValue={defaultValue}
    name="search"
    onInput={({ target }) => callback((target as HTMLInputElement).value)}
    placeholder={label}
    type="search"
  />
);

interface DropdownProps {
  callback: (value: string) => void;
  defaultValue?: string;
  name: string;
  options: Array<{
    text: string;
    value: string;
  }>;
}

const UseDropdown = ({ name, defaultValue, options, callback }: DropdownProps) => (
  <select
    className={styles.dropdown}
    defaultValue={defaultValue ?? options[0].value}
    key={name}
    name={name}
    onInput={({ target }) => callback((target as HTMLSelectElement).value)}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.text}
      </option>
    ))}
  </select>
);

interface Props {
  dropdowns?: Array<DropdownProps>;
  search?: UseSearchProps;
}

const Filters = ({ search, dropdowns }: Props) => (
  <div className={styles.filters}>
    {dropdowns?.map((item) => UseDropdown(item))}
    {!!search && UseSearch(search)}
  </div>
);

export default Filters;
