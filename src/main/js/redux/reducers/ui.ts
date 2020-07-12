import {SET_CURRENT_PROJECT, SET_LOADING, SET_MESSAGE} from '../actions/ui/types';
import {Message, UserRole} from '../../propTypes';
import {RootAction} from '../store';

export interface UIState {
  message: Message | null
  loading: boolean,
  currentProject: number | null,
  currentProjectUserRole: UserRole | null
}

const initialState: UIState = {
  message: null,
  loading: true,
  currentProject: null,
  currentProjectUserRole: null,
};

export default (state: UIState = initialState, action: RootAction) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };

    case SET_CURRENT_PROJECT:
      return {
        ...state,
        currentProject: action.payload.id,
        currentProjectUserRole: action.payload.userRole,
      };

    default:
      return state;
  }
};
