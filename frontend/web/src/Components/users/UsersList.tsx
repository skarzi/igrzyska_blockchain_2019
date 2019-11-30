import React from 'react';
import { observer } from 'mobx-react';

import { useStores } from 'Models/root-store';
import { Loading } from 'Components/loading';

export const UsersList = observer(() => {
  const { userStore } = useStores();

  if (userStore.state === 'pending') {
    return <Loading />;
  }

  return (
    <>
      {userStore.users.map(user => (
        <p>{user.name}</p>
      ))}
    </>
  );
});
