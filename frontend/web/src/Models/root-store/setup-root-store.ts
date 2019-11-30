import { onSnapshot } from 'mobx-state-tree';

import { RootStoreModel } from './root-store';
import { Environment } from '../environment';

const ROOT_STATE_STORAGE_KEY = 'root';

export async function createEnvironment() {
  const env = new Environment();
  await env.setup();
  return env;
}

export async function setupRootStore() {
  const env = await createEnvironment();

  const data = JSON.parse(localStorage.getItem(ROOT_STATE_STORAGE_KEY) || '{}');

  const rootStore = RootStoreModel.create(data, env);

  onSnapshot(rootStore, snapshot =>
    localStorage.setItem(ROOT_STATE_STORAGE_KEY, JSON.stringify(snapshot)),
  );

  return rootStore;
}
