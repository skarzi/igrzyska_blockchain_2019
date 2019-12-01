import { GeneralApiProblem } from './api-problem';

export type GetFundResult =
  | {
      kind: 'ok';
      id?: number;
    }
  | GeneralApiProblem;

export type GetFundDetails = any | null;
