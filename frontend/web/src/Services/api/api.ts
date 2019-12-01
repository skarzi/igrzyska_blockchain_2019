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
    return {
      kind: 'ok',
      id: 1,
    };
  }

  async getFundDetails(fundID): Promise<GetFundDetails> {
    // const response: ApiResponse<any> = await this.apisauce.get(`/fundings/${fundID}`);

    // if (response.status === 200) {
    //   return response.data;
    // }

    return {
      collected_amount: '0',
      description: 'No description',
      entries: [],
      id: 1,
      name: 'Test Auction',
      soft_cap: '',
      token_price: '5',
      organisation: 1,
      tokens_amount: '10000000',
    };
  }
}
