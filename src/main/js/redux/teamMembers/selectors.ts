/* eslint-disable arrow-body-style */
import { createSelector } from 'reselect';
import { RootState } from '../rootReducer';
import { getProjectById } from '../projects/selectors';
import { getUser } from '../user/selectors';
import { UserRole } from '../utilTypes';
import { TeamMembersState } from './types';

export function getTeamMembers(state: RootState): TeamMembersState {
  return state.teamMembers;
}

export function getTeamMembersByUserId(state: RootState, userId: number) {
  return getTeamMembers(state).filter((member) => member.userId === userId);
}

export function getTeamMembersByUserIdAndRole(userRole: UserRole) {
  return createSelector(getTeamMembersByUserId, (teamMembers) => {
    return teamMembers.filter(({ role }) => role === userRole);
  });
}

export const getTeamMembersByProjectId = createSelector(
  getProjectById, getTeamMembers,
  (project, teamMembers) => {
    if (!project) return [];
    return project.get('team').map((memberId) => teamMembers.get(`${memberId}`)).toArray();
  },
);

export const getCurrentUserRoleByProjectId = createSelector(
  getTeamMembersByProjectId, getUser,
  (teamMembers, user) => teamMembers.find(({ userId }) => userId === user.id).role,
);
