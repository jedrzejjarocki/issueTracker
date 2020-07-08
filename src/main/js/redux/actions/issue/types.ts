import {Issue} from "../../../propTypes";
import {IssuesState} from "../../reducers/issues";

export const ADD_ISSUE = 'ADD_ISSUE';
export const SET_ISSUES = 'SET_ISSUES';
export const UPDATE_ISSUE = 'UPDATE_ISSUE';
export const DELETE_ISSUE = 'DELETE_ISSUE';

export interface AddIssueAction {
    type: typeof ADD_ISSUE
    payload: Issue
}

export interface SetIssuesAction {
    type: typeof SET_ISSUES
    payload: IssuesState
}

export interface UpdateIssueAction {
    type: typeof UPDATE_ISSUE
    payload: Issue
}

export interface DeleteIssueAction {
    type: typeof DELETE_ISSUE
    payload: {
        issueId: number,
        listId: number
    }
}

export type IssueAction = AddIssueAction | SetIssuesAction | UpdateIssueAction | DeleteIssueAction
