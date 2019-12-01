import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Gets a list of users.
   */
  async getUsers(): Promise<Types.GetUsersResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const convertUser = raw => {
      return {
        id: raw.id,
        name: raw.name,
      }
    }

    // transform the data into the format we are expecting
    try {
      const rawUsers = response.data
      const resultUsers: Types.User[] = rawUsers.map(convertUser)
      return { kind: "ok", users: resultUsers }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a single user by ID
   */

  async getUser(id: string): Promise<Types.GetUserResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users/${id}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultUser: Types.User = {
        id: response.data.id,
        name: response.data.name,
      }
      return { kind: "ok", user: resultUser }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async getFundings(): Promise<Types.GetFundings> {
    const response: ApiResponse<any> = await this.apisauce.get(`/fundings/`);

    if (response.status === 200) {
      return response.data;
    }

    return null;
  }

  async invest(fundingId, amount): Promise<Types.SignResult> {
    const response: ApiResponse<Types.SignResult> = await this.apisauce.post(`/fundings/entries/`, {
      tokens_amount: amount,
      funding: fundingId,
      token_price: '1'
    }, {
      headers: {
        Authorization: 'Token c3bef782426cb533a3ecca8b8e0716067235ca4d'
      }
    });

    if (response.status === 201) {
      return response.data;
    }

    return null;
  }

  async sign(id) {
    const response = await this.apisauce.post(`/fundings/entries/${id}/complete/`, {
      signed_token: '1234'
    }, {
      headers: {
        Authorization: 'Token c3bef782426cb533a3ecca8b8e0716067235ca4d'
      }
    });

    if (response.status === 201) {
      return { kind: 'ok' }
    }

    return null;
  }
}
