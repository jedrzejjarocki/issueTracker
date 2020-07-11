import {RootState} from "../reducers/rootReducer";
import {getProjectById} from "./project";
import {createSelector} from "reselect";
import {getUser} from "./user";

export const getTeamMembers = (state: RootState) => state.teamMembers;

export const getTeamMembersAsArray = (state: RootState) => Object.values(getTeamMembers(state));

export const getTeamMembersByProjectId = createSelector(getProjectById, getTeamMembers, (project, teamMembers) => {
  return project === undefined ? [] : project.team.map(memberId => teamMembers[memberId])
})

export const getTeamMembersByUserId = (state: RootState, userId: number) =>
  getTeamMembersAsArray(state).filter(member => member.userId === userId);

export const getCurrentUserRoleByProjectId = createSelector(getTeamMembersByProjectId, getUser, (teamMembers, user) => {
  return teamMembers.find(({ userId}) => userId === user.id).role
})