import {RootAction} from '../rootReducer';
import {initialState, SET_CURRENT_PROJECT, SET_LOADING, SET_NOTIFICATION, UIState,} from './types';

export default (state: UIState = initialState, action: RootAction) => {
  switch (action.type) {
    case SET_LOADING:
      return state.set('loading', action.payload);

    case SET_NOTIFICATION:
      return state.set('notification', action.payload);

    case SET_CURRENT_PROJECT:
      return state.set('currentProject', action.payload);

    default:
      return state;
  }
};
