import {ADD_ISSUE, DELETE_ISSUE} from '../actions/issue';
import {ADD_PROJECT} from '../actions/project';
import {ADD_SPRINT, DELETE_SPRINT, SET_ISSUES_LISTS, UPDATE_SPRINT,} from '../actions/issuesLists';

const setSprint = (state, payload) => {
  const stateCopy = { ...state };
  stateCopy[payload.sprint.id] = payload.sprint;
  return stateCopy;
};

export default (state = null, { type, payload }) => {
  switch (type) {
    case SET_ISSUES_LISTS:
      return payload;

    case ADD_SPRINT:
    case UPDATE_SPRINT:
      return setSprint(state, payload);

    case DELETE_SPRINT: {
      const stateCopy = { ...state };
      delete stateCopy[payload.sprint.id];
      return stateCopy;
    }

    case ADD_ISSUE: {
      const list = state[payload.listId];
      list.issues = [payload.id, ...list.issues];
      return state;
    }

    case DELETE_ISSUE: {
      const list = state[payload.listId];
      const issues = [...list.issues];
      const issueIdx = issues.findIndex((i) => i === payload.issueId);
      issues.splice(issueIdx, 1);
      list.issues = issues;
      return state;
    }

    case ADD_PROJECT: {
      const stateCopy = { ...state };
      stateCopy[payload.backlog.id] = payload.backlog;
      return stateCopy;
    }

    default:
      return state;
  }
};
