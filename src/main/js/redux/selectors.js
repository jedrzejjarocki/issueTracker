// UI
export const getLoading = (state) => state.ui.loading;
export const getCurrentProjectId = (state) => state.ui.currentProject;

// PROJECTS
export const getProjectById = (id, state) => state.projects[id] || null;

// TEAM MEMBERS
export const getTeamMembers = (projectId, state) => {
  const project = getProjectById(projectId, state);
  if (!project) return null;
  return project.team.map((memberId) => state.teamMembers[memberId]);
};

export const getUserRoleByProjectId = (userId, projectId, state) => (
  getTeamMembers(projectId, state).find((member) => member.userId === userId).role
);

// SPRINTS

// sorted -> active first
export const getSprintsByProjectId = (id, state) => {
  const project = getProjectById(id, state);
  if (!project) return null;
  return (project.sprints || [])
    .map((sprintId) => state.issuesLists[sprintId])
    .sort((s1, s2) => (s1.startDate === null) - (s2.startDate === null));
};

// ISSUES
export const getIssuesByListId = (id, state) => (
  Object.values(state.issues)
    .filter(({ listId }) => listId === id)
);
