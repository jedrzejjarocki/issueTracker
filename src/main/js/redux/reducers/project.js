import {addProject, addSprint, addTeamMember, deleteSprint, deleteTeamMember, setProjects,} from '../actions/types';

const initialState = [];

const editSprints = (state, projectId, cb) => {
  const stateCopy = { ...state };
  const project = stateCopy[projectId];
  project.sprints = cb(project.sprints);

  stateCopy[project.id] = project;
  return stateCopy;
};

const editTeam = (state, projectId, cb) => {
  const stateCopy = { ...state };
  const project = stateCopy[projectId];
  project.team = cb(project.team);

  stateCopy[project.id] = project;
  return stateCopy;
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case setProjects:
      return payload;

    case addProject: {
      const stateCopy = { ...state };
      const {
        name, id, projectKey, team, backlog,
      } = payload;

      const project = {
        name,
        id,
        projectKey,
        sprints: [],
        team: [team[0].id],
        backlog: backlog.id,
      };

      stateCopy[id] = project;
      return stateCopy;
    }

    case addSprint:
      return editSprints(state, payload.projectId, (sprints) => [payload.sprint.id, ...sprints]);

    case deleteSprint: {
      return editSprints(state, payload.projectId, ((sprints) => {
        const idx = sprints.findIndex((sprintId) => sprintId === payload.sprint.id);
        const sprintsCopy = [...sprints];
        sprintsCopy.splice(idx, 1);
        return sprintsCopy;
      }));
    }

    case addTeamMember: {
      return editTeam(state, payload.projectId, (team) => [payload.id, ...team]);
    }

    case deleteTeamMember: {
      return editTeam(state, payload.projectId, (team) => {
        const idx = team.findIndex((memberId) => memberId === payload.memberId);
        const teamCopy = [...team];
        teamCopy.splice(idx, 1);
        return teamCopy;
      });
    }

    default:
      return state;
  }
};
