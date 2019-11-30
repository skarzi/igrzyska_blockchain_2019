import { types, flow, getEnv, Instance } from 'mobx-state-tree';

import { Environment } from 'Models/environment';
import { GetFundDetails, GetFundResult } from 'Services/api/api.types';

export const FundEntriesUser = types.model('FundEntryUser', {
  id: types.integer,
  username: types.string,
});

export const FundEntries = types.model('FundEntry', {
  id: types.integer,
  user: FundEntriesUser,
  tokens_amount: types.integer,
  token_price: types.string,
});

export const FundModel = types.model('Fund', {
  name: types.maybeNull(types.string),
  tokens: types.maybeNull(types.integer),
  tokenPrice: types.maybeNull(types.string),
  equity: types.maybeNull(types.string),
  id: types.maybeNull(types.number),
  entries: types.optional(types.array(FundEntries), []),
  entriesFetched: types.maybeNull(types.integer),
});

export type FundType = ReturnType<typeof FundModel.create>;

export const FundStoreModel = types
  .model('FundStore')
  .props({
    fund: types.optional(FundModel, { entriesFetched: null }),
    state: types.optional(
      types.enumeration(['untouched', 'pending', 'submitted', 'error']),
      'untouched',
    ),
  })
  .actions(self => ({
    submitFund: flow(function*() {
      self.state = 'pending';

      const env: Environment = getEnv(self);
      const response: GetFundResult = yield env.api.submitFund({
        name: self.fund.name,
        organisation: 1,
        tokens_amount: self.fund.tokens,
        token_price: self.fund.tokenPrice,
      });

      if (!response || response.kind === 'bad-data') {
        console.error('FundStore: failed to send fund');

        self.state = 'error';

        return;
      }

      if (response.kind === 'ok') {
        self.state = 'submitted';
        self.fund.id = response.id || null;
      }
    }),

    getFundDetails: flow(function*() {
      self.state = 'pending';

      const env: Environment = getEnv(self);
      const response: GetFundDetails = yield env.api.getFundDetails(self.fund.id);

      if (!response) {
        console.error('FundStore: failed to fetch fund');
        self.state = 'error';
        return;
      }

      self.state = 'submitted';
      self.fund.entries.replace(response.entries);
      self.fund.entriesFetched = Date.now();
      self.fund.tokens = response.tokens_amount;
    }),
    setFundName(name) {
      self.fund.name = name;
    },
    setFundTokens(tokens) {
      self.fund.tokens = parseInt(tokens);
    },
    setFundTokenPrice(tokenPrice) {
      self.fund.tokenPrice = tokenPrice;
    },
    setFundEquity(equity) {
      self.fund.equity = equity;
    },
  }));

export interface FundStore extends Instance<typeof FundStoreModel> {}
