import React from 'react';
import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react';

import { useStores } from '../../Models/root-store';
import { FundCharts } from '../../Components/charts/Donut/Donut';

import styles from './FundView.module.scss';

export const FundView = observer(props => {
  const { fundStore } = useStores();

  const fetchFunds = async () => {
    await fundStore.getFundDetails();
  };

  React.useEffect(() => {
    fundStore.getFundDetails();

    setTimeout(fetchFunds, 2000);
  }, []);

  return (
    <Grid container justify="center" alignItems="center" spacing={1}>
      <h1>{fundStore.fund.entries.length}</h1>
      <Grid item xs={12} className={styles.cell}>
        <h1 style={{ marginBottom: 30 }}>Fund auction name: {fundStore.fund.name}</h1>
      </Grid>

      <Grid item xs={6} className={styles.cell}>
        <h2>Fund tokens {fundStore.fund.tokens}</h2>
      </Grid>
      <Grid item xs={6} className={styles.cell}>
        <h2>Fund tokens {fundStore.fund.tokens}</h2>
      </Grid>
      <Grid item xs={12} className={styles.cell}>
        {fundStore.fund.entriesFetched ? <FundCharts fund={fundStore.fund} /> : <div />}
      </Grid>
    </Grid>
  );
});
