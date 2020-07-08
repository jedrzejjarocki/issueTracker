import {Message, UserRole} from "../../../propTypes";

export const SET_LOADING = 'SET_LOADING';
export const SET_MESSAGE = 'SET_MESSAGE';
export const SET_CURRENT_PROJECT = 'SET_CURRENT_PROJECT';

export interface SetLoadingAction {
  type: typeof SET_LOADING
  payload: boolean
}

export interface SetMessageAction {
  type: typeof SET_MESSAGE
  payload: Message
}

export interface SetCurrentProjectAction {
  type: typeof SET_CURRENT_PROJECT
  payload: {
    id: number
    userRole: UserRole
  }
}

export type UIAction = SetLoadingAction | SetMessageAction | SetCurrentProjectAction