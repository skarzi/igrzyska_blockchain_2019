import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { BasicLayout } from 'Components/layouts';
import routes from 'Utils/routes';

import { MainView } from './MainView';

function RootView() {
  return (
    <BasicLayout>
      <Switch>
        <Route path={routes.ROOT} component={MainView} />
      </Switch>
    </BasicLayout>
  );
}

export default RootView;
