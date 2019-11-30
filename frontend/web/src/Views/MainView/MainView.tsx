import React from 'react';
import { TextField, Grid, Button } from '@material-ui/core';
import { observer } from 'mobx-react';

import { useStores } from '../../Models/root-store';
import routes from '../../Utils/routes';

import styles from './MainView.module.scss';

export const MainView = observer(props => {
  const { fundStore } = useStores();

  const { tokens, tokenPrice } = fundStore.fund;

  const tokensNumber = tokens !== '' && tokens !== null ? parseInt(tokens, 10) : 0;
  const tokenPriceNumber = tokenPrice !== '' && tokenPrice !== null ? parseInt(tokenPrice, 10) : 0;
  const totalAmount = tokensNumber * tokenPriceNumber;

  const handleSubmit = e => {
    e.preventDefault();

    fundStore.submitFund();
  };

  if (fundStore.state === 'submitted') {
    props.history.push(routes.FUND);

    return null;
  }

  return (
    <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
      <Grid container direction="row" alignItems="center" item lg={5}>
        <h1 style={{ marginBottom: 30 }}>Prepare fund raising auction</h1>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Fund raising auction name"
            value={fundStore.fund.name || ''}
            onChange={e => fundStore.setFundName(e.target.value)}
            fullWidth
            style={{ marginBottom: 15 }}
          />

          <TextField
            label="How many tokens you want to sell"
            value={fundStore.fund.tokens || ''}
            onChange={e => fundStore.setFundTokens(e.target.value)}
            fullWidth
            style={{ marginBottom: 15 }}
          />

          <TextField
            label="Price per one token in PLN"
            value={fundStore.fund.tokenPrice || ''}
            onChange={e => fundStore.setFundTokenPrice(e.target.value)}
            fullWidth
            style={{ marginBottom: 15 }}
          />

          <TextField
            label="Amount of equity we are selling"
            value={fundStore.fund.equity || ''}
            onChange={e => fundStore.setFundEquity(e.target.value)}
            fullWidth
            style={{ marginBottom: 30 }}
          />

          <Grid direction="row" justify="space-between" container>
            <Button className={styles.margin} color="primary" variant="contained" type="submit">
              Submit
            </Button>

            {totalAmount !== 0 && totalAmount ? <div>Total amount: {totalAmount} PLN</div> : null}
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
});
