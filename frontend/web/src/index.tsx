import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from 'Config/service-worker';
import { ROOT_NODE } from 'Utils/constants';

import App from './App';

import 'normalize.css';
import 'Styles/main.scss';

ReactDOM.render(<App />, ROOT_NODE as HTMLElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
