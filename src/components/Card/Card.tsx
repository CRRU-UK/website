import Link from "next/link";

import { Catalogues } from "@/helpers/constants";

import styles from "./Card.module.scss";

interface Props {
  disabled?: boolean;
  link: string;
  name?: string;
  reference?: string;
  title: string;
  type: Catalogues;
}

const Card = ({ type, title, reference, name, link, disabled = false }: Props) => {
  const classes = [styles.card, styles["no-image"]];

  if (type === Catalogues.BottlenoseDolphin) {
    classes.push(styles.dolphin);
  }

  if (type === Catalogues.MinkeWhale) {
    classes.push(styles.whale);
  }

  if (disabled) {
    classes.push(styles.disabled);
  }

  return (
    <Link className={classes.join(" ")} href={link}>
      <span className={styles.icon}></span>
      <span className={styles.text}>
        <span className={styles.id}>
          <b>{title}</b>
          {reference && <span className={styles.reference}>{reference}</span>}
        </span>
        <span className={styles.name}>{name ?? <i>Unnamed</i>}</span>
      </span>
    </Link>
  );
};

export default Card;
