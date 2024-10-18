import styles from './Tree.module.scss';

import type { CatalogueBottlenoseDolphin, CatalogueMinkeWhale } from '@/helpers/types';

import { Catalogues } from '@/helpers/constants';

import { Card } from '@/components';

interface Props {
  type: Catalogues,
  entry: CatalogueBottlenoseDolphin['entry'] | CatalogueMinkeWhale['entry'],
  mother?: CatalogueBottlenoseDolphin['mother'],
  calves?: CatalogueBottlenoseDolphin['calves'],
}

const Tree = ({
  type,
  entry,
  mother,
  calves,
}: Props) => {
  const emptyElement = (<span className={styles.empty}>Unknown</span>)

  let motherElement = emptyElement;
  if (mother) {
    motherElement = (
      <Card
        type={type}
        id={`#${mother.id}`}
        reference={mother?.reference ? `#${mother.reference}` : undefined}
        name={mother?.name ? String(mother.name) : undefined}
        link={`/research/catalogues/${type}/${mother.slug}`}
      />
    );
  }

  let calvesElement = emptyElement;
  if (calves?.length) {
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
