import { GeneralApiProblem } from './api-problem';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export type GetUsersResult = { kind: 'ok'; users: User[] } | GeneralApiProblem;
export type GetUserResult = { kind: 'ok'; user: User } | GeneralApiProblem;
