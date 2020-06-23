import * as actionType from '../actions/types';

const initialState = [];

const getProjectIdxById = (id, state) => state.findIndex((project) => project.id === id);

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.setProjects:
      return payload;

    case actionType.setProjectDetails: {
      const idx = getProjectIdxById(payload.id, state);
      const projects = [...state];
      projects.splice(idx, 1, payload);
      return projects;
    }

    case actionType.addProject: {
      return [payload, ...state];
    }

    case actionType.addIssue: {
      const idx = getProjectIdxById(payload.projectId, state);
      const projects = [...state];
      const project = { ...projects[idx] };
      if (project.backlog.id === payload.issue.listId) {
        project.backlog.issues = [payload.issue, ...project.backlog.issues];
      } else {
        const sprintIdx = project.sprints.findIndex(
          (sprint) => sprint.id === payload.issue.listId,
        );
        const sprint = { ...project.sprints[sprintIdx] };
        sprint.issues = [payload.issue, ...sprint.issues];
        project.sprints.splice(sprintIdx, 1, sprint);
      }
      projects.splice(idx, 1, project);
      return projects;
    }

    case actionType.setIssue: {
      const idx = getProjectIdxById(payload.projectId, state);
      const projects = [...state];
      const project = { ...projects[idx] };
      if (project.backlog.id === payload.issue.listId) {
        const issueIdx = project.backlog.issues.findIndex(
          (issue) => issue.id === payload.issue.id,
        );
        project.backlog.issues.splice(issueIdx, 1, payload.issue);
      } else {
        const sprintIdx = project.sprints.findIndex(
          (sprint) => sprint.id === payload.issue.listId,
        );
        const sprint = { ...project.sprints[sprintIdx] };
        const issueIdx = project.backlog.issues.findIndex(
          (issue) => issue.id === payload.issue.id,
        );
        sprint.issues.splice(issueIdx, 1, payload.issue);
        project.sprints.splice(sprintIdx, 1, sprint);
      }
      return projects;
    }

    case actionType.addSprint: {
      const projectIdx = getProjectIdxById(payload.projectId, state);
      const projects = [...state];
      const project = { ...projects[projectIdx] };
      project.sprints = [payload.sprint, ...project.sprints];
      projects.splice(projectIdx, 1, project);
      return projects;
    }

    case actionType.setSprint: {
      const projectIdx = getProjectIdxById(payload.projectId, state);
      const projects = [...state];
      const project = { ...projects[projectIdx] };
      const sprintIdx = project.sprints.findIndex((sprint) => sprint.id === payload.sprint.id);
      project.sprints.splice(sprintIdx, 1, payload.sprint);
      projects.splice(projectIdx, 1, project);
      return projects;
    }

    default:
      return state;
  }
};
