/* eslint-disable react/require-default-props */

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
}: Props) => (
  <div className={`${styles.hero} ${!background && styles['hero-no-image']} ${plain && styles['hero-plain']}`}>
    <div className={`${styles['hero-container']} ${wide ? styles.wide : ''}`}>
      <h2>{subtitle}</h2>
      {title && <h3>{title}</h3>}
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

export default Hero;
