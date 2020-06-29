import {SET_CURRENT_PROJECT, SET_LOADING, SET_MESSAGE} from '../actions/ui';

const initialState = {
  message: null,
  loading: true,
  currentProject: null,
  currentProjectUserRole: '',
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: payload,
      };

    case SET_MESSAGE:
      return {
        ...state,
        message: payload,
      };

    case SET_CURRENT_PROJECT:
      return {
        ...state,
        currentProject: payload.id,
        currentProjectUserRole: payload.userRole,
      };

    default:
      return state;
  }
};
