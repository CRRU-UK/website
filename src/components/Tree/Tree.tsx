import { Card } from "@/components";
import type { Catalogues } from "@/helpers/constants";
import type { CatalogueBottlenoseDolphin } from "@/helpers/types";
import styles from "./Tree.module.scss";

interface Props {
  data: CatalogueBottlenoseDolphin;
  type: Catalogues.BottlenoseDolphin;
}

const Tree = ({ type, data }: Props) => {
  const { entry, mother, calves } = data;

  const emptyElement = <span className={styles.empty}>Unknown</span>;

  let motherElement = emptyElement;
  if (mother) {
    motherElement = <Card catalogue={type} entry={mother} />;
  }

  let calvesElement = emptyElement;
  if (calves.length) {
    calvesElement = (
      <ul>
        {calves.map((item, index) => (
          <li key={item.id}>
            {index === 0 && <span className={styles.last}>Last recorded calf</span>}
            <Card catalogue={type} entry={item} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={styles.tree}>
      <li className={styles.mother}>
        <b>
          <span>Mother</span>
        </b>
        {motherElement}
      </li>

      <li className={styles.name}>
        <Card catalogue={type} disabled entry={entry} />
      </li>

      <li className={styles.calves}>
        <b>
          <span>Calves</span>
        </b>
        {calvesElement}
      </li>
    </ul>
  );
};

export default Tree;
