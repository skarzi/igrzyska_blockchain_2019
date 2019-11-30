import { types, flow, getEnv, Instance } from 'mobx-state-tree';

import { Environment } from 'Models/environment';
import { GetUsersResult } from 'Services/api/api.types';

export const UserModel = types.model('User', {
  id: types.number,
  name: types.string,
  username: types.string,
  email: types.string,
});

type UserType = ReturnType<typeof UserModel.create>;

export const UserStoreModel = types
  .model('UsersStore')
  .props({
    users: types.optional(types.array(UserModel), []),
    state: types.optional(types.enumeration('State', ['pending', 'done', 'error']), 'pending'),
  })
  .actions(self => ({
    removeUser: (id: number) => {
      const index = self.users.findIndex((user: UserType) => user.id === id);
      self.users.splice(index, 1);
    },
    fetchUsers: flow(function*() {
      self.state = 'pending';

      const env: Environment = getEnv(self);
      const response: GetUsersResult = yield env.api.getUsers();

      if (!response || response.kind === 'bad-data') {
        console.error('UsersStore: failed to fetch users');

        self.state = 'error';

        return;
      }

      if (response.kind === 'ok' && response.users) {
        self.users.replace(response.users);

        self.state = 'done';
      }
    }),
  }))
  .views(self => ({
    get count() {
      return self.users.length;
    },
  }));

export interface UserStore extends Instance<typeof UserStoreModel> {}
