import React from 'react';
import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react';

import { useStores } from '../../Models/root-store';
// import routes from '../../Utils/routes';

// import styles from './FundView.module.scss';

export const FundView = observer(props => {
  const { fundStore } = useStores();

  console.log({ fundStore });

  return (
    <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
      <Grid container direction="row" alignItems="center" item lg={5}>
        <h1 style={{ marginBottom: 30 }}>Prepare fund raising auction</h1>
      </Grid>
    </Grid>
  );
});
