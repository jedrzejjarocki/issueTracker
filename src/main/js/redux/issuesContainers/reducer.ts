import { Map, updateIn } from 'immutable';
import { RootAction } from '../rootReducer';
import {
  ADD_SPRINT,
  DELETE_SPRINT,
  IssuesContainersState,
  MANIPULATE_ISSUES_ORDER,
  SET_ISSUES_CONTAINERS,
  UPDATE_SPRINT,
} from './types';
import { ADD_ISSUE, DELETE_ISSUE } from '../issues/types';
import { ADD_PROJECT } from '../projects/types';
import Backlog from '../../entities/Backlog';
import { IssuesContainer } from '../../entities/IssuesContainer';

export default (state: IssuesContainersState = Map(), action: RootAction) => {
  switch (action.type) {
    case SET_ISSUES_CONTAINERS:
      return action.payload;

    case ADD_SPRINT:
    case UPDATE_SPRINT: {
      const { sprint } = action.payload;
      return state.set(`${sprint.id}`, sprint);
    }

    case MANIPULATE_ISSUES_ORDER: {
      const { containerId, callback } = action.payload;
      return updateIn(state, [containerId, 'issues'], callback);
    }

    case DELETE_SPRINT: {
      const backlogId = `${action.payload.backlogId}`;
      const { issues: sprintIssues, id: sprintId } = action.payload.sprint;
      return updateIn(state, [backlogId, 'issues'], (issues) => issues.concat(sprintIssues))
        .delete(`${sprintId}`);
    }

    case ADD_ISSUE: {
      const { id: issueId, containerId } = action.payload;
      const issuesKeyPath = [`${containerId}`, 'issues'];
      return updateIn(state, issuesKeyPath, (issues) => issues.unshift(issueId));
    }

    case DELETE_ISSUE: {
      const { issueId, containerId } = action.payload;
      return updateIn(state, [`${containerId}`, 'issues'], (issues) => issues.filter((issue: number) => issue !== issueId));
    }

    case ADD_PROJECT: {
      const { id } = action.payload.backlog;
      return state.set(`${id}`, new Backlog({ id }) as IssuesContainer);
    }

    default:
      return state;
  }
};
