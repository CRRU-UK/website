import Link from "next/link";

import { Catalogues } from "@/helpers/constants";
import type { CatalogueBasicInfo } from "@/helpers/types";

import styles from "./Card.module.scss";

interface Props {
  catalogue: Catalogues;
  disabled?: boolean;
  entry: CatalogueBasicInfo;
  /** `fill` takes the width of its container, `fixed` sets its own. */
  size?: "fill" | "fixed";
}

const Card = ({ catalogue, entry, disabled = false, size = "fill" }: Props) => {
  const classes = [styles.card];

  if (size === "fixed") {
    classes.push(styles.fixed);
  }

  if (catalogue === Catalogues.BottlenoseDolphin) {
    classes.push(styles.dolphin);
  }

  if (catalogue === Catalogues.MinkeWhale) {
    classes.push(styles.whale);
  }

  if (disabled) {
    classes.push(styles.disabled);
  }

  return (
    <Link className={classes.join(" ")} href={`/research/catalogues/${catalogue}/${entry.slug}`}>
      <span className={styles.icon}></span>
      <span className={styles.text}>
        <span className={styles.id}>
          <b>{`#${entry.id}`}</b>
          {!!entry.reference && <span className={styles.reference}>{`#${entry.reference}`}</span>}
        </span>
        <span className={styles.name}>{entry.name || <i>Unnamed</i>}</span>
      </span>
    </Link>
  );
};

export default Card;
