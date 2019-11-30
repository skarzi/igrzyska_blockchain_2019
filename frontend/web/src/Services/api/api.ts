import { ApisauceInstance, create, ApiResponse } from 'apisauce';

import { ApiConfig, DEFAULT_API_CONFIG } from './api-config';
import { GetFundResult } from './api.types';

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

  async submitFund(fund): Promise<GetFundResult> {
    const response: ApiResponse<any> = await this.apisauce.post('/fundings/', fund);

    if (response.status === 201) {
      return {
        kind: 'ok',
        id: response.data.id,
      };
    }

    return null;
  }
}
