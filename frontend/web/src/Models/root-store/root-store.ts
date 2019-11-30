import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { FundStoreModel } from 'Models/fund-store';

export const RootStoreModel = types.model('RootStore').props({
  fundStore: types.optional(FundStoreModel, {}),
});

export interface RootStore extends Instance<typeof RootStoreModel> {}

export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
