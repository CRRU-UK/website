import Link from "next/link";

import { CatalogueSearch } from "@/components";
import type { Catalogues } from "@/helpers/constants";
import type { CatalogueBasicInfo } from "@/helpers/types";
import styles from "./Toolbar.module.scss";

interface Props {
  catalogue: Catalogues;
  next: CatalogueBasicInfo | null;
  previous: CatalogueBasicInfo | null;
}

const Toolbar = ({ catalogue, previous, next }: Props) => {
  const controlButton = (info: CatalogueBasicInfo | null, type: "previous" | "next") => {
    const classes = [styles.button];

    if (type === "previous") {
      classes.push(styles["button-previous"]);
    } else if (type === "next") {
      classes.push(styles["button-next"]);
    }

    const text = type === "previous" ? "Previous" : "Next";

    if (!info) {
      classes.push(styles["button-disabled"]);

      return (
        <div className={classes.join(" ")}>
          <span>{text}</span>
        </div>
      );
    }

    return (
      <Link className={classes.join(" ")} href={`/research/catalogues/${catalogue}/${info.slug}`}>
        <span>{text}</span>
      </Link>
    );
  };

  return (
    <section className={styles.toolbar}>
      <CatalogueSearch catalogue={catalogue} />
      <div className={styles.controls}>
        {controlButton(previous, "previous")}
        {controlButton(next, "next")}
      </div>
    </section>
  );
};

export default Toolbar;
