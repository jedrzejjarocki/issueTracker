/* eslint-disable arrow-body-style */
import { createSelector } from 'reselect';
import { getTeamMembers, getTeamMembersByUserIdAndRole } from './teamMembers/selectors';
import { getProjects } from './projects/selectors';
import { UserWithProjects } from './user/selectors';
import { UserRole } from './utilTypes';
import Project from '../entities/Project';

export const getUsersWithTheirProjects = createSelector(
  getTeamMembers, getProjects,
  (teamMembers, projects) => {
    const users: {
      [id: number]: UserWithProjects
    } = {};

    teamMembers.forEach(({
      userId,
      projectId,
      username,
      role,
    }) => {
      const { name, id } = projects.get(`${projectId}`) as Project;

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
  },
);

export const getProjectsWhereCurrentUserIsLeader = createSelector(
  getTeamMembersByUserIdAndRole(UserRole.LEADER), getProjects,
  (teamMembers, projects) => {
    return teamMembers.map((member) => projects.get(`${member.projectId}`) as Project)
      .valueSeq().toArray();
  },
);
