import Image from 'next/image';

import styles from './Hero.module.scss';

interface Props {
  title: string,
  subtitle?: string,
  background?: string | null,
  plain?: boolean,
  wide?: boolean,
}

const Hero = ({
  title,
  subtitle,
  background,
  plain = false,
  wide = false,
}: Props) => {
  const classes = [styles.hero];

  if (!background) {
    classes.push(styles['hero-no-image']);
  }

  if (plain) {
    classes.push(styles['hero-plain']);
  }

  return (
    <div className={classes.join(' ')}>
    <div className={`${styles['hero-container']} ${wide ? styles.wide : ''}`}>
      {subtitle && <h2>{subtitle}</h2>}
      <h1>{title}</h1>
    </div>
    {background && (
      <Image
        src={background}
        alt=""
        quality={90}
        priority
        fill
      />
    )}
  </div>
  );
};

export default Hero;
