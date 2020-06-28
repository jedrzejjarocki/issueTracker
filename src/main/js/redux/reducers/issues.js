import {addIssue, deleteIssue, deleteSprint, deleteTeamMember, setIssues, updateIssue,} from '../actions/types';

const setIssue = (state, issue) => {
  const stateCopy = { ...state };
  stateCopy[issue.id] = issue;
  return stateCopy;
};

export default (state = null, { type, payload }) => {
  switch (type) {
    case setIssues:
      return payload || {};

    case addIssue:
      return setIssue(state, payload);

    case updateIssue:
      return setIssue(state, payload);

    case deleteIssue: {
      const updatedState = { ...state };
      delete updatedState[payload.issueId];
      return updatedState;
    }

    case deleteSprint: {
      const updatedState = { ...state };
      Object.values(updatedState).map((issue) => {
        if (issue.listId === payload.sprint.id) {
          issue.listId = payload.backlogId;
        }
      });
      return updatedState;
    }

    case deleteTeamMember: {
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
