import {IssuesListsState} from "../../reducers/issuesLists";
import {Sprint} from "../../../propTypes";

export const SET_ISSUES_LISTS = 'SET_ISSUES_LISTS';
export const ADD_SPRINT = 'ADD_SPRINT';
export const UPDATE_SPRINT = 'UPDATE_SPRINT';
export const DELETE_SPRINT = 'DELETE_SPRINT';

export interface SetIssuesListAction {
    type: typeof SET_ISSUES_LISTS
    payload: IssuesListsState
}

export interface AddSprintAction {
    type: typeof ADD_SPRINT,
    payload: {
        projectId: number,
        sprint: Sprint
    }
}

export interface UpdateSprintAction {
    type: typeof UPDATE_SPRINT
    payload: {
        projectId: number
        sprint: Sprint
    }
}

export interface DeleteSprintAction {
    type: typeof DELETE_SPRINT
    payload: {
        sprint: Sprint
        backlogId: number
        projectId: number
    }
}

export type IssuesListsAction = SetIssuesListAction | AddSprintAction | UpdateSprintAction | DeleteSprintAction;
