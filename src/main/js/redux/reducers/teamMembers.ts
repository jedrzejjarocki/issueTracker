import {ADD_PROJECT} from '../actions/project/types';
import {ADD_MEMBER, DELETE_MEMBER, SET_TEAM_MEMBERS, UPDATE_MEMBER,} from '../actions/teamMember/types';
import {TeamMember} from '../../propTypes';
import {RootAction} from '../store';

export interface TeamMembersState {
  [id: string]: TeamMember
}

export default (state: TeamMembersState = {}, action: RootAction) => {
  switch (action.type) {
    case SET_TEAM_MEMBERS:
      return action.payload;

    case ADD_PROJECT: {
      const stateCopy = { ...state };
      const member = action.payload.team[0];
      stateCopy[member.id] = member;
      return stateCopy;
    }

    case ADD_MEMBER:
    case UPDATE_MEMBER: {
      const stateCopy = { ...state };
      stateCopy[action.payload.id] = action.payload;
      return stateCopy;
    }

    case DELETE_MEMBER: {
      const stateCopy = { ...state };
      delete stateCopy[action.payload.memberId];
      return stateCopy;
    }

    default:
      return state;
  }
};
