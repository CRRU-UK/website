import styles from "./Toolbar.module.scss";

import React, { useState, useEffect } from "react";

import type { CatalogueAPIResponse, CatalogueBasicInfo } from "@/helpers/types";

import Link from "next/link";

import { Catalogues } from "@/helpers/constants";

import { Card, Loading } from "@/components";

interface Props {
  catalogue: Catalogues;
  previous: CatalogueBasicInfo | null;
  next: CatalogueBasicInfo | null;
}

const Toolbar = ({ catalogue, previous, next }: Props) => {
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState<null | CatalogueAPIResponse>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (search === "") {
      setData(null);
      return;
    }

    const getData = async () => {
      setLoading(true);

      const response = await fetch(`/api/catalogues/${catalogue}?search=${search}&page=1`);
      const result: CatalogueAPIResponse = await response.json();
      setData(result);

      setLoading(false);
    };

    const timeout = setTimeout(getData, 500);
    return () => clearTimeout(timeout);
  }, [search, catalogue]);

  const handleSearchChange = (value: string) => setSearch(value);

  const searchClasses = [styles.search];
  if (loading || data) {
    searchClasses.push(styles.active);
  }

  const showResults = loading || data;

  const noResultsElement = <li className={styles["no-results"]}>No results</li>;

  const resultsElements =
    data?.meta?.totalItems === 0
      ? noResultsElement
      : data?.items.map((item) => (
          <li key={item.id}>
            <Card
              type={catalogue}
              id={`#${item.id}`}
              name={item?.name ? String(item.name) : undefined}
              reference={item?.reference ? `#${item.reference}` : undefined}
              link={`/research/catalogues/${catalogue}/${item.slug}`}
            />
          </li>
        ));

  const controlButton = (data: CatalogueBasicInfo | null, type: "previous" | "next") => {
    const classes = [styles.button];

    if (type === "previous") {
      classes.push(styles["button-previous"]);
    } else if (type === "next") {
      classes.push(styles["button-next"]);
    }

    const text = type === "previous" ? "Previous" : "Next";

    if (!data) {
      classes.push(styles["button-disabled"]);

      return (
        <div className={classes.join(" ")}>
          <span>{text}</span>
        </div>
      );
    }

    return (
      <Link href={`/research/catalogues/${catalogue}/${data.slug}`} className={classes.join(" ")}>
        <span>{text}</span>
      </Link>
    );
  };

  return (
    <section className={styles.toolbar}>
      <div className={searchClasses.join(" ")}>
        <input
          type="search"
          placeholder="Search by name, ID, reference, birth year..."
          onChange={({ target }) => handleSearchChange((target as HTMLInputElement).value)}
        />

        {showResults && (
          <ul className={styles.results}>
            {loading ? (
              <li className={styles["loading"]}>
                <Loading type={catalogue} />
              </li>
            ) : (
              resultsElements
            )}
          </ul>
        )}
      </div>
      <div className={styles.controls}>
        {controlButton(previous, "previous")}
        {controlButton(next, "next")}
      </div>
    </section>
  );
};

export default Toolbar;
