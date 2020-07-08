import {Message, UserRole} from "../../../propTypes";
import {SET_CURRENT_PROJECT, SET_LOADING, SET_MESSAGE, SetLoadingAction, SetMessageAction} from "./types";

export const setMessage = (message: Message): SetMessageAction => ({
  type: SET_MESSAGE,
  payload: message,
});

export const setLoading = (loading: boolean): SetLoadingAction => ({
  type: SET_LOADING,
  payload: loading,
});

export const setCurrentProject = (id: number, userRole: UserRole) => ({
  type: SET_CURRENT_PROJECT,
  payload: {
    id, userRole,
  },
});
