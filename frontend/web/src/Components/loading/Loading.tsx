import React from 'react';

import { CircleSpinner } from 'Components/spinners';

import styles from './Loading.module.scss';

export const Loading = () => {
  return (
    <div className={styles.root}>
      <CircleSpinner size="large" />
    </div>
  );
};
