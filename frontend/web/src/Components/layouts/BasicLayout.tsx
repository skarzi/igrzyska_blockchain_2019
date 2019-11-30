import React from 'react';

import styles from './BasicLayout.module.scss';

export const BasicLayout = props => {
  const { children } = props;

  return (
    <div className={styles.basicLayout}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default BasicLayout;
