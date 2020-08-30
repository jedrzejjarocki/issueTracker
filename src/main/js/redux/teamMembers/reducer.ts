import { Map } from 'immutable';
import TeamMember from '../../entities/TeamMember';
import { RootAction } from '../rootReducer';
import { ADD_PROJECT } from '../projects/types';
import {
  ADD_MEMBER, DELETE_MEMBER, SET_TEAM_MEMBERS, TeamMembersState, UPDATE_MEMBER,
} from './types';

export default (state: TeamMembersState = Map(), action: RootAction) => {
  switch (action.type) {
    case SET_TEAM_MEMBERS:
      return action.payload;

    case ADD_MEMBER:
    case UPDATE_MEMBER: {
      return state.set(`${action.payload.id}`, new TeamMember(action.payload));
    }

    case DELETE_MEMBER: {
      return state.delete(`${action.payload.memberId}`);
    }

    case ADD_PROJECT: {
      const member = action.payload.team[0];
      return state.set(`${member.id}`, new TeamMember(member));
    }

    default:
      return state;
  }
};
