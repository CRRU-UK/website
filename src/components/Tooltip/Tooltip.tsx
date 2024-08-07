/* istanbul ignore file */

import { useState } from 'react';

import styles from './Tooltip.module.scss';

export interface TooltipProps {
  text: string,
}

const Tooltip = ({
  text,
}: TooltipProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const textClasses = [styles['tooltip-text']];
  const buttonClasses = [styles['tooltip-button']];
  if (open) {
    buttonClasses.push(styles['tooltip-button-active']);
    textClasses.push(styles['tooltip-text-active']);
  }

  return (
    <span
      className={styles.tooltip}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        title="Tooltip"
        className={buttonClasses.join(' ')}
        onKeyDown={() => {}}
        aria-expanded={open}
        tabIndex={0}
      />
      <span className={textClasses.join(' ')}>
        {text}
      </span>
    </span>
  );
};

export default Tooltip;
