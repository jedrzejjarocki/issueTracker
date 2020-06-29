import {ADD_ISSUE, DELETE_ISSUE, SET_ISSUES, UPDATE_ISSUE,} from '../actions/issue';
import {DELETE_MEMBER} from '../actions/teamMember';

import {DELETE_SPRINT} from '../actions/issuesLists';

const setIssue = (state, issue) => {
  const stateCopy = { ...state };
  stateCopy[issue.id] = issue;
  return stateCopy;
};

export default (state = null, { type, payload }) => {
  switch (type) {
    case SET_ISSUES:
      return payload || {};

    case ADD_ISSUE:
      return setIssue(state, payload);

    case UPDATE_ISSUE:
      return setIssue(state, payload);

    case DELETE_ISSUE: {
      const updatedState = { ...state };
      delete updatedState[payload.issueId];
      return updatedState;
    }

    case DELETE_SPRINT: {
      const updatedState = { ...state };
      Object.values(updatedState).map((issue) => {
        if (issue.listId === payload.sprint.id) {
          issue.listId = payload.backlogId;
        }
      });
      return updatedState;
    }

    case DELETE_MEMBER: {
      const updatedState = { ...state };
      Object.values(updatedState).map((issue) => {
        if (issue.assignee === payload.memberId) {
          issue.assignee = null;
        }
      });
      return updatedState;
    }

    default:
      return state;
  }
};
