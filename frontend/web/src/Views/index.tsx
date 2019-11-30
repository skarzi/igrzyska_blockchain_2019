import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { BasicLayout } from 'Components/layouts';
import routes from 'Utils/routes';

import { MainView } from './MainView';
import { FundView } from './FundView';

function RootView() {
  return (
    <BasicLayout>
      <Switch>
        <Route exact path={routes.ROOT} component={MainView} />
        <Route path={routes.FUND} component={FundView} />
      </Switch>
    </BasicLayout>
  );
}

export default RootView;
