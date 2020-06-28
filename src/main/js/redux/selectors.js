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

export const getUserRoleByProjectId = (projectId, state) => (
  projectId ? getTeamMembers(projectId, state).find((member) => member.userId === state.user.id).role : ''
);

export const getUsersWithMemberships = (state) => {
  const users = [];
  const findUserIdx = (userId) => users.findIndex((user) => user.id === userId);
  Object.values(state.teamMembers).map(({
    userId, username, projectId, role,
  }) => {
    const userIdx = findUserIdx(userId);
    const { name, id } = getProjectById(projectId, state);
    if (userIdx !== -1) {
      users[userIdx].memberships.push({
        project: {
          name,
          id,
        },
        role,
      });
    } else {
      users.push({
        id: userId,
        username,
        memberships: [{
          project: {
            name, id,
          },
          role,
        }],
      });
    }
  });
  return users;
};

// SPRINTS

// sorted -> active first
export const getSprintsByProjectId = (id, state) => {
  const project = getProjectById(id, state);
  if (!project) return [];

  return (project.sprints || [])
    .map((sprintId) => state.issuesLists[sprintId])
    .sort((s1, s2) => (s1.startDate === null) - (s2.startDate === null));
};

export const getIssuesListsByProjectId = (id, state) => {
  const project = getProjectById(id, state);
  if (!project) return [];

  const sprints = (project.sprints || []).map((sprintId) => ({
    type: 'Sprint',
    ...state.issuesLists[sprintId],
  }));

  const backlog = {
    type: 'Backlog',
    ...state.issuesLists[project.backlog],
  };

  return [backlog, ...sprints];
};

// ISSUES
export const getIssuesByListId = (id, state) => (
  Object.values(state.issues)
    .filter(({ listId }) => listId === id)
);
