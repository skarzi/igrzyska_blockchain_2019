import { ApisauceInstance, create, ApiResponse } from 'apisauce';

import { ApiConfig, DEFAULT_API_CONFIG } from './api-config';
import { getGeneralApiProblem } from './api-problem';
import * as Types from './api.types';

export class Api {
  apisauce: ApisauceInstance;

  config: ApiConfig;

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
  }

  setup() {
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
      },
    });
  }

  async getUsers(): Promise<Types.GetUsersResult> {
    const response: ApiResponse<any> = await this.apisauce.get('/users');

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    const convertUser = (raw: Types.User) => {
      return {
        id: raw.id,
        name: raw.name,
        username: raw.username,
        email: raw.email,
      };
    };

    try {
      const rawUsers = response.data;
      const resultUsers: Types.User[] = rawUsers.map(convertUser);
      return { kind: 'ok', users: resultUsers };
    } catch {
      return { kind: 'bad-data' };
    }
  }
}
