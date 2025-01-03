import Link from "next/link";

import type { SitemapItem } from "@/helpers/types";

import sitemap from "@/data/sitemap.json";

import styles from "./Breadcrumbs.module.scss";

export interface Props {
  items: Array<SitemapItem>;
  style?: "normal" | "wide" | "inline";
}

const Breadcrumbs = ({ items, style = "normal" }: Props) => {
  const links = items.map(({ title, path }, index) => {
    const last = index === items.length - 1;

    let item = <span>{title}</span>;

    if (!last) {
      item = <Link href={path}>{title}</Link>;
    }

    return <li key={path}>{item}</li>;
  });

  const classes = [styles.breadcrumbs];
  if (style === "wide") {
    classes.push(styles.wide);
  } else if (style === "inline") {
    classes.push(styles.inline);
  }

  return (
    <div className={styles["breadcrumbs-container"]}>
      <ul className={classes.join(" ")}>
        <li>
          <Link href={sitemap.home.path}>{sitemap.home.title}</Link>
        </li>
        {links}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
