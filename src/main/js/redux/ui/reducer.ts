import {Record} from 'immutable';
import {NotificationMessage} from './NotificationMessage';
import {UserRole} from '../utilTypes';
import {RootAction} from '../rootReducer';

type StateProps = {
  notification: NotificationMessage | null
  loading: boolean,
  currentProject: {
    id: number,
    userRole: UserRole
  }
};

export type UIState = Record<StateProps>;

const initialProps: StateProps = {
  notification: null,
  loading: true,
  currentProject: null,
};

export const initialState: UIState = Record(initialProps)(initialProps);

export const SET_LOADING = 'SET_LOADING';
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const SET_CURRENT_PROJECT = 'SET_CURRENT_PROJECT';

export interface SetLoadingAction {
  type: typeof SET_LOADING
  payload: boolean
}

export interface SetNotificationAction {
  type: typeof SET_NOTIFICATION
  payload: NotificationMessage
}

export interface SetCurrentProjectAction {
  type: typeof SET_CURRENT_PROJECT
  payload: {
    id: number
    userRole: UserRole
  }
}

export type UIAction = SetLoadingAction | SetNotificationAction | SetCurrentProjectAction;
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
