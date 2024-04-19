/* eslint-disable react/require-default-props */

import Link from 'next/link';

import styles from './Button.module.scss';

interface Props {
  text: string,
  link: string,
  external?: boolean,
  inline?: boolean,
}

const Button = ({
  text,
  link,
  external = false,
  inline = false,
}: Props) => {
  const buttonStyles = [
    styles.button,
  ];

  if (inline) {
    buttonStyles.push(styles.inline);
  }

  return (
    <Link
      href={link}
      className={buttonStyles.join(' ')}
      rel={external ? 'noopener noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      {text}
    </Link>
  );
};

export default Button;
