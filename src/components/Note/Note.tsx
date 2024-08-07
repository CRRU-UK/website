/* eslint-disable @typescript-eslint/no-explicit-any */

import styles from './Note.module.scss';

interface Props {
  children: any,
}

const Note = ({
  children,
}: Props) => (
  <section className={styles.note}>
    {children}
  </section>
);

export default Note;
