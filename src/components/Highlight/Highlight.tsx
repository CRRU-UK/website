/* eslint-disable @typescript-eslint/no-explicit-any */

import styles from "./Highlight.module.scss";

interface Props {
  children: any;
  warning?: boolean;
}

const Highlight = ({ children, warning }: Props) => (
  <section
    className={`${styles.highlight} ${warning && styles["highlight-warning"]}`}
  >
    {children}
  </section>
);

export default Highlight;
