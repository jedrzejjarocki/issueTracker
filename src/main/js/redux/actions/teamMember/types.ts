import {TeamMembersState} from "../../reducers/teamMembers";
import {TeamMember, UserRole} from "../../../propTypes";

export const SET_TEAM_MEMBERS = 'SET_TEAM_MEMBERS';
export const UPDATE_MEMBER_ROLE = 'UPDATE_MEMBER_ROLE';
export const DELETE_MEMBER = 'DELETE_MEMBER';
export const ADD_MEMBER = 'ADD_MEMBER';

export interface SetTeamMembersAction {
  type: typeof SET_TEAM_MEMBERS
  payload: TeamMembersState
}

export interface UpdateMemberRoleAction {
  type: typeof UPDATE_MEMBER_ROLE
  payload: TeamMember
}

export interface AddTeamMemberPayload {
  id: number
  projectId: number
  userId: number
  username: string
  role: UserRole
}

export interface AddTeamMemberAction {
  type: typeof ADD_MEMBER
  payload: AddTeamMemberPayload
}

export interface DeleteTeamMemberAction {
  type: typeof DELETE_MEMBER
  payload: {
    projectId: number
    memberId: number
  }
}

export type TeamMemberAction = SetTeamMembersAction | UpdateMemberRoleAction | AddTeamMemberAction | DeleteTeamMemberAction
