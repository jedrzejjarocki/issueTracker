import {Map} from 'immutable';
import {IssuesContainer} from '../../entities/IssuesContainer';

export const SET_ISSUES_CONTAINERS = 'SET_ISSUES_CONTAINERS';
export const ADD_SPRINT = 'ADD_SPRINT';
export const UPDATE_SPRINT = 'UPDATE_SPRINT';
export const DELETE_SPRINT = 'DELETE_SPRINT';

export type IssuesContainersState = Map<string, IssuesContainer>;

export interface SetIssuesContainersAction {
  type: typeof SET_ISSUES_CONTAINERS
  payload: IssuesContainersState
}

export interface AddSprintAction {
  type: typeof ADD_SPRINT,
  payload: {
    projectId: number,
    sprint: IssuesContainer
  }
}

export interface UpdateSprintAction {
  type: typeof UPDATE_SPRINT
  payload: {
    projectId: number
    sprint: IssuesContainer
  }
}

export interface DeleteSprintAction {
  type: typeof DELETE_SPRINT
  payload: {
    sprint: IssuesContainer
    backlogId: number
    projectId: number
  }
}

export type IssuesContainersAction = SetIssuesContainersAction
| AddSprintAction
| UpdateSprintAction
| DeleteSprintAction;
