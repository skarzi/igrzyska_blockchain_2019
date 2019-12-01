import { GeneralApiProblem } from "./api-problem"

export interface User {
  id: number
  name: string
}

export type GetFundings = {} | null;

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
export type SignResult = { kind: "ok"; token: string, id: string } | GeneralApiProblem
