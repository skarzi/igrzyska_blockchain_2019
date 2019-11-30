import classNames from 'classnames';
import React from 'react';

import styles from './Circle.module.scss';

export interface Props {
  className?: string;
  size?: 'large' | 'medium' | 'compact';
  wrapped?: boolean;
}

export const CircleSpinner = (props: Props) => {
  const { className, size, wrapped } = props;

  const classes = classNames(
    styles.circle,
    {
      [styles[size || '']]: !!size,
    },
    className,
  );

  const Circle = <div className={classes} />;

  if (wrapped) {
    return <div className={styles.root}>{Circle}</div>;
  }

  return Circle;
};
