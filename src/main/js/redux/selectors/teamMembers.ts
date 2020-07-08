import {RootState} from "../reducers/rootReducer";
import {getProjectById} from "./project";

export const getTeamMembers = (state: RootState) => state.teamMembers;

export const getTeamMembersAsArray = (state: RootState) => Object.values(getTeamMembers(state));

export const getTeamMembersByProjectId = (state: RootState, projectId: number) => {
  const project = getProjectById(state, projectId);

  if (project === undefined) return []

  return project.team.map((memberId: number) => getTeamMembers(state)[memberId])
}

export const getTeamMembersByUserId = (state: RootState, userId: number): any[] =>
  getTeamMembersAsArray(state).filter(member => member.userId === userId);

export const getCurrentUserRoleByProjectId = (state: RootState, projectId: number) => {
  return getTeamMembersByProjectId(state, projectId).find(member => member.userId === state.user.id).userId;
}