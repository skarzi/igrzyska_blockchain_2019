import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { RootStore, RootStoreProvider, setupRootStore } from 'Models/root-store';
import RootView from 'Views';

export const App = () => {
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined);

  useEffect(() => {
    setupRootStore().then(setRootStore);
  }, []);

  if (!rootStore) {
    return null;
  }

  return (
    <RootStoreProvider value={rootStore}>
      <Router>
        <RootView />
      </Router>
    </RootStoreProvider>
  );
};

export default App;
