import styles from './Tree.module.scss';

import type { CatalogueBottlenoseDolphin } from '@/helpers/types';

import { Catalogues } from '@/helpers/constants';

import { Card } from '@/components';

interface Props {
  type: Catalogues,
  data: CatalogueBottlenoseDolphin,
}

const Tree = ({
  type,
  data,
}: Props) => {
  const {
    entry,
    mother,
    calves,
  } = data;

  const emptyElement = (<span className={styles.empty}>Unknown</span>)

  let motherElement = emptyElement;
  if (mother) {
    motherElement = (
      <Card
        type={type}
        id={`#${mother.id}`}
        name={mother?.name ? String(mother.name) : undefined}
        reference={mother?.reference ? `#${mother.reference}` : undefined}
        link={`/research/catalogues/bottlenose-dolphin/${mother.slug}`}
      />
    );
  }

  let calvesElement = emptyElement;
  if (calves.length) {
    calvesElement = (
      <ul>
        {
          calves.map((item) => (
            <li key={item.id}>
              <Card
                type={type}
                id={`#${item.id}`}
                reference={item?.reference ? `#${item.reference}` : undefined}
                name={item?.name ?? undefined}
                link={item.slug}
              />
            </li>
          ))
        }
      </ul>
    );
  }

  return (
    <ul className={styles.tree}>
      <li className={styles.mother}>
        <b><span>Mother</span></b>
        {motherElement}
      </li>

      <li className={styles.name}>
        <Card
          type={type}
          id={`#${entry.id}`}
          reference={entry?.reference ? `#${entry.reference}` : undefined}
          name={entry.name ?? undefined}
          link={''}
          disabled
        />
      </li>

      <li className={styles.calves}>
        <b><span>Calves</span></b>
        {calvesElement}
      </li>
    </ul>
  ); 
}

export default Tree;
