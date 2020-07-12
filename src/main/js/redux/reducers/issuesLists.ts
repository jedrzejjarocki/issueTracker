import {ADD_ISSUE, DELETE_ISSUE} from '../actions/issue/types';
import {ADD_PROJECT} from '../actions/project/types';
import {ADD_SPRINT, DELETE_SPRINT, SET_ISSUES_LISTS, UPDATE_SPRINT,} from '../actions/issuesList/types';
import {IssuesContainer, Sprint} from '../../propTypes';
import {RootAction} from '../store';

const setSprint = (state: IssuesListsState, payload: { sprint: Sprint}) => {
  const stateCopy = { ...state };
  stateCopy[payload.sprint.id] = payload.sprint;
  return stateCopy;
};

export interface IssuesListsState {
  [id: string]: IssuesContainer
}

export default (state: IssuesListsState = {}, action: RootAction) => {
  switch (action.type) {
    case SET_ISSUES_LISTS:
      return action.payload;

    case ADD_SPRINT:
    case UPDATE_SPRINT:
      return setSprint(state, action.payload);

    case DELETE_SPRINT: {
      const stateCopy = { ...state };
      delete stateCopy[action.payload.sprint.id];
      const backlog = stateCopy[action.payload.backlogId];
      backlog.issues = [...action.payload.sprint.issues, ...backlog.issues];
      return stateCopy;
    }

    case ADD_ISSUE: {
      const list = state[action.payload.listId];
      list.issues = [action.payload.id, ...list.issues];
      return state;
    }

    case DELETE_ISSUE: {
      const list = state[action.payload.listId];
      const issues = [...list.issues];
      const issueIdx = issues.findIndex((i) => i === action.payload.issueId);
      issues.splice(issueIdx, 1);
      list.issues = issues;
      return state;
    }

    case ADD_PROJECT: {
      const stateCopy = { ...state };
      stateCopy[action.payload.backlog.id] = action.payload.backlog;
      return stateCopy;
    }

    default:
      return state;
  }
};
