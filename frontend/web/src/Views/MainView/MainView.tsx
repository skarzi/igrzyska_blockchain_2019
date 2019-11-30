import React from 'react';
import { TextField, Grid, Button } from '@material-ui/core';
import { observer } from 'mobx-react';

import { useStores } from '../../Models/root-store';

import styles from './MainView.module.scss';

export const MainView = observer(() => {
  const [name, setName] = React.useState('');
  const [tokens, setTokens] = React.useState('');
  const [tokenPrice, setTokenPrice] = React.useState('');
  const [equity, setEquity] = React.useState('');
  const { fundStore } = useStores();

  const tokensNumber = tokens !== '' ? parseInt(tokens, 10) : 0;
  const tokenPriceNumber = tokenPrice !== '' ? parseInt(tokenPrice, 10) : 0;
  const totalAmount = tokensNumber * tokenPriceNumber;

  const handleSubmit = e => {
    e.preventDefault();

    fundStore.submitFund({
      name,
      organisation: 1,
      tokens_amount: tokens,
      token_price: tokenPrice,
    });
  };

  if (fundStore.state === 'submitted') {
    return <div>Done!!!</div>;
  }

  return (
    <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
      <Grid container direction="row" alignItems="center" item lg={5}>
        <h1 style={{ marginBottom: 30 }}>Prepare fund raising auction</h1>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Fund raising auction name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            style={{ marginBottom: 15 }}
          />

          <TextField
            label="How many tokens you want to sell"
            value={tokens}
            onChange={e => setTokens(e.target.value)}
            fullWidth
            style={{ marginBottom: 15 }}
          />

          <TextField
            label="Price per one token in PLN"
            value={tokenPrice}
            onChange={e => setTokenPrice(e.target.value)}
            fullWidth
            style={{ marginBottom: 15 }}
          />

          <TextField
            label="Amount of equity we are selling"
            value={equity}
            onChange={e => setEquity(e.target.value)}
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
