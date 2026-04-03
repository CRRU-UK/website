import Link from "next/link";

import styles from "./Button.module.scss";

interface Props {
  external?: boolean;
  inline?: boolean;
  link: string;
  text: string;
}

const Button = ({ text, link, external = false, inline = false }: Props) => {
  const buttonStyles = [styles.button];

  if (inline) {
    buttonStyles.push(styles.inline);
  }

  return (
    <Link
      className={buttonStyles.join(" ")}
      href={link}
      rel={external ? "noopener noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      {text}
    </Link>
  );
};

export default Button;
