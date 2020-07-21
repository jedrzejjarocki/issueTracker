import {createSelector} from 'reselect';
import {getTeamMembers, getTeamMembersByUserIdAndRole} from './teamMembers/selectors';
import {getProjects} from './projects/selectors';
import {UserWithProjects} from './user/selectors';
import {UserRole} from './utilTypes';

export const getUsersWithTheirProjects = createSelector(getTeamMembers, getProjects, (teamMembers, projects) => {
  const users: { [id: number]: UserWithProjects } = {};

  teamMembers.map(({
    userId, projectId, username, role,
  }) => {
    const { name, id } = projects.get(String(projectId));

    if (users[userId]) {
      users[userId].projects.push({
        id,
        projectName: name,
        userRole: role,
      });
    } else {
      users[userId] = {
        userId,
        username,
        projects: [{
          id,
          projectName: name,
          userRole: role,
        }],
      };
    }
  });

  return Object.values(users);
});

export const getProjectsWhereCurrentUserIsLeader = createSelector(getTeamMembersByUserIdAndRole(UserRole.LEADER), getProjects,
  (teamMembers, projects) => teamMembers.map((member) => projects.get(String(member.projectId))).valueSeq().toArray());
