import { useEffect, useState } from "react";

import { Card, Loading } from "@/components";
import type { Catalogues } from "@/helpers/constants";
import type { CatalogueAPIResponse, CatalogueBasicInfo } from "@/helpers/types";

import styles from "./CatalogueSearch.module.scss";

interface Props {
  catalogue: Catalogues;
  /** Restricts which results render. */
  filter?: (item: CatalogueBasicInfo) => boolean;
  /** When set, results are buttons calling this instead of navigating. */
  onSelect?: (item: CatalogueBasicInfo) => void;
  placeholder?: string;
  variant?: "floating" | "inline";
}

const CatalogueSearch = ({
  catalogue,
  filter,
  onSelect,
  placeholder = "Search catalogue by name, ID, reference...",
  variant = "inline",
}: Props) => {
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<null | CatalogueAPIResponse>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (search === "") {
      setData(null);
      return;
    }

    let cancelled = false;

    const getData = async () => {
      setLoading(true);

      const response = await fetch(`/api/catalogues/${catalogue}?search=${search}&page=1`);

      const result: CatalogueAPIResponse = await response.json();

      if (cancelled) {
        return;
      }

      setData(result);
      setLoading(false);
    };

    const timeout = setTimeout(getData, 500);
    return () => {
      clearTimeout(timeout);
      cancelled = true;
    };
  }, [search, catalogue]);

  const searchClasses = [styles.search, styles[variant]];
  if (loading || data) {
    searchClasses.push(styles.active);
  }

  const showResults = loading || data !== null;

  const items = data?.items.filter(filter ?? (() => true)) ?? [];

  const handleSelect = (item: CatalogueBasicInfo) => {
    onSelect?.(item);
    setSearch("");
  };

  const resultsElements =
    items.length === 0 ? (
      <li className={styles["no-results"]}>No results</li>
    ) : (
      items.map((item) => (
        <li key={item.id}>
          <Card
            catalogue={catalogue}
            entry={item}
            onSelect={onSelect ? () => handleSelect(item) : undefined}
          />
        </li>
      ))
    );

  return (
    <div className={searchClasses.join(" ")}>
      <input
        aria-label="Search the catalogue"
        onChange={({ target }) => setSearch((target as HTMLInputElement).value)}
        placeholder={placeholder}
        type="search"
        value={search}
      />

      {!!showResults && (
        <ul className={styles.results}>
          {loading ? (
            <li className={styles.loading}>
              <Loading type={catalogue} />
            </li>
          ) : (
            resultsElements
          )}
        </ul>
      )}
    </div>
  );
};

export default CatalogueSearch;
