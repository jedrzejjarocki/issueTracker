import {addProject, addTeamMember, deleteTeamMember, setTeamMembers, updateMemberRole,} from '../actions/types';

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

    case updateMemberRole: {
      const stateCopy = { ...state };
      stateCopy[payload.id] = payload;
      return stateCopy;
    }

    case addTeamMember: {
      const stateCopy = { ...state };
      stateCopy[payload.id] = payload;
      return stateCopy;
    }

    case deleteTeamMember: {
      const stateCopy = { ...state };
      delete stateCopy[payload.memberId];
      return stateCopy;
    }

    default:
      return state;
  }
};
