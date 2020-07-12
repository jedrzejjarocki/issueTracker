import {createSelector} from 'reselect';
import {RootState} from '../reducers/rootReducer';
import {getTeamMembersAsArray, getTeamMembersByUserId} from './teamMembers';
import {UserRole} from '../../propTypes';

export const getProjects = (state: RootState) => state.projects;

export const getProjectsAsArray = (state: RootState) => Object.values(getProjects(state));

export const getProjectById = (state: RootState, id: number | string) => state.projects[id];

export const getProjectsWhereCurrentUserIsLeader = createSelector(getTeamMembersByUserId, getProjects, (teamMembers, projects) => teamMembers.filter((member) => member.role === UserRole.LEADER).map((member) => projects[member.projectId]));

export interface UserWithProjects {
  userId: number
  username: string
  projects: {
    id: number
    projectName: string
    userRole: UserRole
  }[]
}

export const getUsersWithTheirProjects = createSelector(getTeamMembersAsArray, getProjects, (teamMembers, projects) => {
  const users: { [id: number]: UserWithProjects } = {};

  teamMembers.map(({
    userId, projectId, username, role,
  }) => {
    const { name, id } = projects[projectId];

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
