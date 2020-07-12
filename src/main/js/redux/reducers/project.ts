import {ADD_MEMBER, DELETE_MEMBER} from '../actions/teamMember/types';
import {ADD_PROJECT, SET_PROJECTS} from '../actions/project/types';
import {ADD_SPRINT, DELETE_SPRINT} from '../actions/issuesList/types';
import {Project} from '../../propTypes';
import {RootAction} from '../store';

const editSprints = (state: ProjectsState, projectId: number, cb: (sprints: number[]) => number[]) => {
  const stateCopy = { ...state };
  const project = stateCopy[projectId];
  project.sprints = cb(project.sprints);

  stateCopy[project.id] = project;
  return stateCopy;
};

const editTeam = (state: ProjectsState, projectId: number, cb: (team: number[]) => number[]) => {
  const stateCopy = { ...state };
  const project = stateCopy[projectId];
  project.team = cb(project.team);

  stateCopy[project.id] = project;
  return stateCopy;
};

export interface ProjectsState {
  [id: string]: Project
}

export default (state: ProjectsState = {}, action: RootAction) => {
  switch (action.type) {
    case SET_PROJECTS:
      return action.payload;

    case ADD_PROJECT: {
      const stateCopy = { ...state };
      const {
        name, id, projectKey, team, backlog,
      } = action.payload;

      const project = {
        name,
        id,
        projectKey,
        sprints: [] as number[],
        team: [team[0].id],
        backlog: backlog.id,
      };

      stateCopy[id] = project;
      return stateCopy;
    }

    case ADD_SPRINT:
      return editSprints(state, action.payload.projectId, (sprints: number[]) => [action.payload.sprint.id, ...sprints]);

    case DELETE_SPRINT: {
      return editSprints(state, action.payload.projectId, ((sprints: number[]) => {
        const idx = sprints.findIndex((sprintId) => sprintId === action.payload.sprint.id);
        const sprintsCopy = [...sprints];
        sprintsCopy.splice(idx, 1);
        return sprintsCopy;
      }));
    }

    case ADD_MEMBER: {
      return editTeam(state, action.payload.projectId, (team: number[]) => [action.payload.id, ...team]);
    }

    case DELETE_MEMBER: {
      return editTeam(state, action.payload.projectId, (team: number[]) => {
        const idx = team.findIndex((memberId: number) => memberId === action.payload.memberId);
        const teamCopy = [...team];
        teamCopy.splice(idx, 1);
        return teamCopy;
      });
    }

    default:
      return state;
  }
};
