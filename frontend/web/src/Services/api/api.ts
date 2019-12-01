import { ApisauceInstance, create, ApiResponse } from 'apisauce';

import { ApiConfig, DEFAULT_API_CONFIG } from './api-config';
import { GetFundResult, GetFundDetails } from './api.types';

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

  async getFundDetails(fundID): Promise<GetFundDetails> {
    const response: ApiResponse<any> = await this.apisauce.get(`/fundings/${fundID}`);

    if (response.status === 200) {
      return response.data;
    }

    return null;
  }
}
