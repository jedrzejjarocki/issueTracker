import { Map } from 'immutable';
import { UserRole } from '../utilTypes';
import TeamMember from '../../entities/TeamMember';

export type TeamMembersState = Map<string, TeamMember>;
export const SET_TEAM_MEMBERS = 'SET_TEAM_MEMBERS';
export const UPDATE_MEMBER = 'UPDATE_MEMBER';
export const DELETE_MEMBER = 'DELETE_MEMBER';
export const ADD_MEMBER = 'ADD_MEMBER';

export interface SetTeamMembersAction {
  type: typeof SET_TEAM_MEMBERS
  payload: TeamMembersState
}

export interface UpdateMemberAction {
  type: typeof UPDATE_MEMBER
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

export type TeamMembersAction =
  SetTeamMembersAction
  | UpdateMemberAction
  | AddTeamMemberAction
  | DeleteTeamMemberAction;
