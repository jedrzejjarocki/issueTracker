import {addProject, setTeamMembers} from '../actions/types';

export default (state = null, { type, payload }) => {
  switch (type) {
    case setTeamMembers:
      return payload;

    case addProject: {
      const stateCopy = { ...state };
      const member = payload.team[0];
      stateCopy[member.id] = member;
      return stateCopy;
    }

    default:
      return state;
  }
};
