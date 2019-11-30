import { API_URL } from 'Utils/constants';

export interface ApiConfig {
  url: string;
  timeout: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: API_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
};
