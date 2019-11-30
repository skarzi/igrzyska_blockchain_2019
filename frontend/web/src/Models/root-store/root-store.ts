import { Instance, SnapshotOut, types } from 'mobx-state-tree';

import { UserStoreModel } from 'Models/user-store';

export const RootStoreModel = types
  .model('RootStore')
  .props({
    userStore: types.optional(UserStoreModel, {}),
  })
  .actions(self => ({
    afterCreate: () => {
      if (self.userStore.users.length === 0) {
        self.userStore.fetchUsers();
      }
    },
  }));

export interface RootStore extends Instance<typeof RootStoreModel> {}

export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
