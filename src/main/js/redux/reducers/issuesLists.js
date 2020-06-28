import {
  addIssue,
  addProject,
  addSprint,
  deleteIssue,
  deleteSprint,
  setIssuesLists,
  updateSprint,
} from '../actions/types';

const setSprint = (state, payload) => {
  const stateCopy = { ...state };
  stateCopy[payload.sprint.id] = payload.sprint;
  return stateCopy;
};

export default (state = null, { type, payload }) => {
  switch (type) {
    case setIssuesLists:
      return payload;

    case addSprint:
      return setSprint(state, payload);

    case updateSprint:
      return setSprint(state, payload);

    case deleteSprint: {
      const stateCopy = { ...state };
      delete stateCopy[payload.sprint.id];
      return stateCopy;
    }

    case addIssue: {
      const list = state[payload.listId];
      list.issues = [payload.id, ...list.issues];
      return state;
    }

    case deleteIssue: {
      const list = state[payload.listId];
      const issues = [...list.issues];
      const issueIdx = issues.findIndex((i) => i === payload.issueId);
      issues.splice(issueIdx, 1);
      list.issues = issues;
      return state;
    }

    case addProject: {
      const stateCopy = { ...state };
      stateCopy[payload.backlog.id] = payload.backlog;
      return stateCopy;
    }

    default:
      return state;
  }
};
