import {User} from "../../../propTypes";

export const SET_USER = 'SET_USER';

export interface SetUserAction {
  type: typeof SET_USER
  payload: User
}

export type UserAction = SetUserAction