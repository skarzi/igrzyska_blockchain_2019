import { Api } from 'Services/api';

export class Environment {
  constructor() {
    this.api = new Api();
  }

  async setup() {
    await this.api.setup();
  }

  api: Api;
}
