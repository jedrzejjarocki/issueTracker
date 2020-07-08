import {ADD_ISSUE, DELETE_ISSUE, SET_ISSUES, UPDATE_ISSUE,} from '../actions/issue/types';

import {DELETE_MEMBER} from '../actions/teamMember/types';

import {Issue} from "../../propTypes";
import {DELETE_SPRINT} from "../actions/issuesList/types";
import {RootAction} from "../store";

const setIssue = (state: IssuesState, issue: Issue) => {
  const stateCopy = { ...state };
  stateCopy[issue.id] = issue;
  return stateCopy;
};

export interface IssuesState {
  [id: string]: Issue
}

export default (state: IssuesState = {}, action: RootAction ) => {
  switch (action.type) {
    case SET_ISSUES:
      return action.payload || {};

    case ADD_ISSUE:
    case UPDATE_ISSUE:
      return setIssue(state, action.payload);

    case DELETE_ISSUE: {
      const updatedState = { ...state };
      delete updatedState[action.payload.issueId];
      return updatedState;
    }

    case DELETE_SPRINT: {
      const updatedState = { ...state };
      Object.values(updatedState).map((issue) => {
        if (issue.listId === action.payload.sprint.id) {
          issue.listId = action.payload.backlogId;
        }
      });
      return updatedState;
    }

    case DELETE_MEMBER: {
      const updatedState = { ...state };
      Object.values(updatedState).map((issue) => {
        if (issue.assignee === action.payload.memberId) {
          issue.assignee = null;
        }
      });
      return updatedState;
    }

    default:
      return state;
  }
};
