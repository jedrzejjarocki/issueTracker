import * as actionType from '../actions/types';

const initialState = {
  message: null,
  loading: true,
  currentProject: null,
  currentProjectUserRole: '',
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.setLoading:
      return {
        ...state,
        loading: payload,
      };

    case actionType.setMessage:
      return {
        ...state,
        message: payload,
      };

    case actionType.setCurrentProject:
      return {
        ...state,
        currentProject: payload.id,
        currentProjectUserRole: payload.userRole,
      };

    default:
      return state;
  }
};
