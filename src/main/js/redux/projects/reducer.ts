import {List, Map, updateIn} from 'immutable';
import Project from '../../entities/Project';
import {RootAction} from '../rootReducer';
import {ADD_SPRINT, DELETE_SPRINT} from '../issuesContainers/types';
import {ADD_PROJECT, ProjectsState, SET_PROJECTS} from './types';
import {ADD_MEMBER, DELETE_MEMBER} from '../teamMembers/types';

export default (state: ProjectsState = Map(), action: RootAction): ProjectsState => {
  switch (action.type) {
    case SET_PROJECTS:
      return action.payload;

    case ADD_PROJECT: {
      const {
        name, id, projectKey, team, backlog,
      } = action.payload;

      const project = {
        name,
        id,
        projectKey,
        sprints: List(),
        team: List([team[0].id]),
        backlog: backlog.id,
      };

      return state.set(`${project.id}`, new Project(project));
    }

    case ADD_SPRINT: {
      const { projectId, sprint } = action.payload;
      return updateIn(state, [`${projectId}`, 'sprints'], (sprints) => sprints.unshift(sprint.id));
    }

    case DELETE_SPRINT: {
      const { projectId, sprint } = action.payload;
      return updateIn(state, [`${projectId}`, 'sprints'],
        (sprints) => sprints.filter((sprintId: number) => sprintId !== sprint.id));
    }

    case ADD_MEMBER: {
      const { projectId, id: memberId } = action.payload;
      return updateIn(state, [`${projectId}`, 'team'], (team) => team.unshift(memberId));
    }

    case DELETE_MEMBER: {
      const { projectId, memberId } = action.payload;
      return updateIn(state, [`${projectId}`, 'team'],
        (team) => team.filter((member: number) => member !== memberId));
    }

    default:
      return state;
  }
};
