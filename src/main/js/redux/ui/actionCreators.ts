import {UserRole} from '../utilTypes';
import {
  SET_CURRENT_PROJECT,
  SET_LOADING,
  SET_NOTIFICATION,
  SetCurrentProjectAction,
  SetLoadingAction,
  SetNotificationAction,
} from './reducer';
import {NotificationMessage} from './NotificationMessage';

export const setNotification = (notification: NotificationMessage): SetNotificationAction => ({
  type: SET_NOTIFICATION,
  payload: notification,
});

export const setLoading = (loading: boolean): SetLoadingAction => ({
  type: SET_LOADING,
  payload: loading,
});

export const setCurrentProject = (id: number, userRole: UserRole): SetCurrentProjectAction => ({
  type: SET_CURRENT_PROJECT,
  payload: {
    id, userRole,
  },
});
