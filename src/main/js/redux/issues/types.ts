import { Map } from 'immutable';
import Issue from '../../entities/Issue';

export const ADD_ISSUE = 'ADD_ISSUE';
export const SET_ISSUES = 'SET_ISSUES';
export const UPDATE_ISSUE = 'UPDATE_ISSUE';
export const UPDATE_ISSUES = 'UPDATE_ISSUES';
export const DELETE_ISSUE = 'DELETE_ISSUE';

export interface AddIssueAction {
  type: typeof ADD_ISSUE
  payload: Issue
}

export type IssuesState = Map<string, Issue>;

export interface SetIssuesAction {
  type: typeof SET_ISSUES
  payload: IssuesState
}

export interface UpdateIssueAction {
  type: typeof UPDATE_ISSUE
  payload: Issue
}

export interface UpdateIssuesAction {
  type: typeof UPDATE_ISSUES
  payload: Issue[]
}

export interface DeleteIssueAction {
  type: typeof DELETE_ISSUE
  payload: {
    issueId: number,
    containerId: number
  }
}

export type IssuesAction = AddIssueAction
| SetIssuesAction
| UpdateIssueAction
| UpdateIssuesAction
| DeleteIssueAction;
