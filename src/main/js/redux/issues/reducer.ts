import {Map} from 'immutable';
import {RootAction} from '../rootReducer';
import {DELETE_SPRINT} from '../issuesContainers/types';
import {ADD_ISSUE, DELETE_ISSUE, IssuesState, SET_ISSUES, UPDATE_ISSUE,} from './types';
import {DELETE_MEMBER} from '../teamMembers/types';

export default (state: IssuesState = Map(), action: RootAction) => {
  switch (action.type) {
    case SET_ISSUES:
      return action.payload;

    case ADD_ISSUE:
    case UPDATE_ISSUE:
      return state.set(`${action.payload.id}`, action.payload);

    case DELETE_ISSUE: {
      return state.delete(`${action.payload.issueId}`);
    }

    case DELETE_SPRINT: {
      const { sprint: { id: sprintId }, backlogId } = action.payload;
      return state.map((issue) => (issue.containerId === sprintId ? issue.set('containerId', backlogId) : issue));
    }

    case DELETE_MEMBER: {
      return state.map((issue) => (issue.assignee === action.payload.memberId ? issue.set('assignee', null) : issue));
    }

    default:
      return state;
  }
};
