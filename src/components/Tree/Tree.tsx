import styles from './Tree.module.scss';

import type { CatalogueBottlenoseDolphin } from '@/helpers/types';

import { Card } from '@/components';

interface Props {
  data: CatalogueBottlenoseDolphin,
}

const Tree = ({
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
        type='bottlenose-dolphin'
        id={`#${mother.id}`}
        name={mother?.name ? String(mother.name) : undefined}
        subid={mother?.auid ? `#${mother.auid}` : undefined}
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
                type='bottlenose-dolphin'
                id={`#${item.id}`}
                subid={item?.auid ? `#${item.auid}` : undefined}
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
          type='bottlenose-dolphin'
          id={`#${entry.id}`}
          subid={entry?.auid ? `#${entry.auid}` : undefined}
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
