import styles from "./Note.module.scss";

interface Props {
  children: React.ReactNode;
}

const Note = ({ children }: Props) => <section className={styles.note}>{children}</section>;

export default Note;
