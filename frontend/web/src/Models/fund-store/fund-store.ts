import { types, flow, getEnv, Instance } from 'mobx-state-tree';

import { Environment } from 'Models/environment';
import { GetFundResult } from 'Services/api/api.types';

export const FundModel = types.model('Fund', {
  name: types.maybeNull(types.string),
  tokens: types.maybeNull(types.string),
  tokenPrice: types.maybeNull(types.string),
  equity: types.maybeNull(types.string),
});

type FundType = ReturnType<typeof FundModel.create>;

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
    submitFund: flow(function*(fund) {
      self.state = 'pending';

      const env: Environment = getEnv(self);
      const response: GetFundResult = yield env.api.submitFund(fund);

      if (!response || response.kind === 'bad-data') {
        console.error('UsersStore: failed to fetch users');

        self.state = 'error';

        return;
      }

      if (response.kind === 'ok') {
        self.state = 'submitted';
      }
    }),
  }));

export interface FundStore extends Instance<typeof FundStoreModel> {}
