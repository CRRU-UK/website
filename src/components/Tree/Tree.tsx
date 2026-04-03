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
    motherElement = (
      <Card
        link={`/research/catalogues/bottlenose-dolphin/${mother.slug}`}
        name={mother?.name ? String(mother.name) : undefined}
        reference={mother?.reference ? `#${mother.reference}` : undefined}
        title={`#${mother.id}`}
        type={type}
      />
    );
  }

  let calvesElement = emptyElement;
  if (calves.length) {
    calvesElement = (
      <ul>
        {calves.map((item, index) => (
          <li key={item.id}>
            {index === 0 && <span className={styles.last}>Last recorded calf</span>}
            <Card
              link={item.slug}
              name={item?.name ?? undefined}
              reference={item?.reference ? `#${item.reference}` : undefined}
              title={`#${item.id}`}
              type={type}
            />
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
        <Card
          disabled
          link={""}
          name={entry.name ?? undefined}
          reference={entry?.reference ? `#${entry.reference}` : undefined}
          title={`#${entry.id}`}
          type={type}
        />
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
