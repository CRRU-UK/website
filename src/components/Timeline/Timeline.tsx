import styles from './Timeline.module.scss';

interface Props {
  items: Array<string>,
}

const Timeline = ({
  items,
}: Props) => {
  if (!items || items.length < 1) {
    return null;
  }

  const classes = [styles.timeline];
  if (items.length === 1) {
    classes.push(styles['timeline-single']);
  }

  const sortedItems = items.toSorted((a, b) => a.localeCompare(b));

  return (
    <ul className={classes.join(' ')}>
      {sortedItems.map((item) => (
        <li key={item}>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default Timeline;
