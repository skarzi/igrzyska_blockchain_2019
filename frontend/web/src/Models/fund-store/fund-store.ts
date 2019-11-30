import { types, flow, getEnv, Instance } from 'mobx-state-tree';

import { Environment } from 'Models/environment';
import { GetFundResult } from 'Services/api/api.types';

export const FundModel = types.model('Fund', {
  name: types.maybeNull(types.string),
  tokens: types.maybeNull(types.string),
  tokenPrice: types.maybeNull(types.string),
  equity: types.maybeNull(types.string),
  id: types.maybeNull(types.number),
});

export type FundType = ReturnType<typeof FundModel.create>;

export const FundStoreModel = types
  .model('FundStore')
  .props({
    fund: types.optional(FundModel, {}),
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
        console.error('UsersStore: failed to fetch users');

        self.state = 'error';

        return;
      }

      if (response.kind === 'ok') {
        self.state = 'submitted';
        self.fund.id = response.id || null;
      }
    }),
    setFundName(name) {
      self.fund.name = name;
    },
    setFundTokens(tokens) {
      self.fund.tokens = tokens;
    },
    setFundTokenPrice(tokenPrice) {
      self.fund.tokenPrice = tokenPrice;
    },
    setFundEquity(equity) {
      self.fund.equity = equity;
    },
  }));

export interface FundStore extends Instance<typeof FundStoreModel> {}
