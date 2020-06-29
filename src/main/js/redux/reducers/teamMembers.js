import {ADD_PROJECT} from '../actions/project';
import {ADD_MEMBER, DELETE_MEMBER, SET_TEAM_MEMBERS, UPDATE_MEMBER_ROLE,} from '../actions/teamMember';

export default (state = null, { type, payload }) => {
  switch (type) {
    case SET_TEAM_MEMBERS:
      return payload;

    case ADD_PROJECT: {
      const stateCopy = { ...state };
      const member = payload.team[0];
      stateCopy[member.id] = member;
      return stateCopy;
    }

    case UPDATE_MEMBER_ROLE: {
      const stateCopy = { ...state };
      stateCopy[payload.id] = payload;
      return stateCopy;
    }

    case ADD_MEMBER: {
      const stateCopy = { ...state };
      stateCopy[payload.id] = payload;
      return stateCopy;
    }

    case DELETE_MEMBER: {
      const stateCopy = { ...state };
      delete stateCopy[payload.memberId];
      return stateCopy;
    }

    default:
      return state;
  }
};
