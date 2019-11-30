import { GeneralApiProblem } from './api-problem';

export type GetFundResult =
  | {
      kind: 'ok';
      id?: number;
    }
  | GeneralApiProblem;
