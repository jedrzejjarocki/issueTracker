import {addIssue, addProject, addSprint, deleteSprint, setIssuesLists, updateSprint,} from '../actions/types';

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
      // @Todo move issues to backlog
      return stateCopy;
    }

    case addIssue: {
      const list = state[payload.listId];
      list.issues = [payload.id, ...list.issues];
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
