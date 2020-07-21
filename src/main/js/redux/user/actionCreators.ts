import axios from 'axios';
import {Dispatch} from 'redux';
import React from 'react';
import {fromJS, isKeyed, List, Map, Record,} from 'immutable';
import {LOGIN_URL, LOGOUT_URL, USERS_URL,} from '../../api/commons';
import {setLoading, setNotification} from '../ui/actionCreators';
import normalize from '../schema';
import {setProjects} from '../projects/actionCreators';
import {setIssuesContainers} from '../issuesContainers/actionCreators';
import {setIssues} from '../issues/actionCreators';
import {setTeamMembers} from '../teamMembers/actionCreators';
import {RouterHistory, UserRole} from '../utilTypes';
import {RootThunk} from '../store';
import {User} from '../../entities/User';
import {SetUserAction} from './reducer';
import {
  accountCreatedMessage,
  checkEmailForPasswordRecoveryLinkMessage,
  defaultErrorNotificationMessage,
  incorrectUsernameOrPasswordMessage,
  NotificationMessage,
  NotificationSeverity,
  passwordChangedSuccessfullyMessage,
  userWithGivenEmailDoesNotExistMessage,
} from '../ui/NotificationMessage';

export const SET_USER = 'SET_USER';

export const setUser = (user: User): SetUserAction => ({
  type: SET_USER,
  payload: user,
});

export interface LoginRequestBody {
  username: string
  password: string
}

interface FetchLogin {
  (requestBody: LoginRequestBody): RootThunk
}

export const fetchLogin: FetchLogin = (requestBody) => async (dispatch) => {
  try {
    const { data } = await axios.post(LOGIN_URL, requestBody);
    const { id, username } = data;
    dispatch(setUser(new User({ id, username })));
  } catch (err) {
    dispatch(setNotification(
      err?.response?.status === 401
        ? incorrectUsernameOrPasswordMessage
        : defaultErrorNotificationMessage,
    ));
  }
};

export interface RegisterRequestBody {
  username: string
  password: string
  email: string
}

interface FetchRegister {
  (requestBody: RegisterRequestBody, toggleFormDialog: () => void, setResponseError: React.Dispatch<any>, token?: string): RootThunk
}

export const fetchRegister: FetchRegister = (
  requestBody,
  toggleFormDialog,
  setResponseError,
  token,
) => (
  async (dispatch) => {
    try {
      const url = USERS_URL + (token ? `?token=${token}` : '');
      const { status } = await axios.post(url, requestBody);

      if (status !== 201) throw new Error();

      dispatch(setNotification(accountCreatedMessage));
      toggleFormDialog();
    } catch (err) {
      const message = err?.response?.data?.message;

      if (message) setResponseError(message);
      else dispatch(setNotification(defaultErrorNotificationMessage));
    }
  }
);

export interface FetchLogoutFunc {
  (): RootThunk
}

export const fetchLogout: FetchLogoutFunc = () => async (dispatch) => {
  try {
    const { status } = await axios.post(LOGOUT_URL);
    if (status !== 200) throw new Error();
    dispatch(setUser(null));
  } catch (err) {
    dispatch(setNotification(defaultErrorNotificationMessage));
  }
};

interface IssueDto {
  id: number
  listId: number
  summary: string
  description: string
  version: number
  type: string
  status: string
  assignee: number | null
  storyPointsEstimate: number
  createdBy: string
  lastModifiedBy: string
  createdTime: string | null
  lastModifiedTime: string | null
}

export interface CurrentUserResponseBody {
  id: number
  username: string
  projects: {
    id: number
    name: string
    projectKey: string
    team: {
      id: number
      userId: number
      projectId: number
      username: string
      role: UserRole
    }[]
    sprints: {
      id: number
      issues: IssueDto[]
      name: string
      goal: string
      startDate: string | null
      endDate: string | null
    }[]
    backlog: {
      id: number
      issues: IssueDto[]
    }
  }[]
}

const setData = (responseBody: CurrentUserResponseBody, dispatch: Dispatch) => {
  const normalized = fromJS(normalize(responseBody), (key, value) => {
    if (isKeyed(value)) {
      return parseInt(key as string, 10) ? Record(value.toJS())(value) : Map(value);
    }
    return List(value);
  });

  const actions = [
    setUser(normalized.get('user').first()),
    setProjects(normalized.get('projects')),
    setIssues(normalized.get('issues')),
    setIssuesContainers(normalized.get('issuesLists')),
    setTeamMembers(normalized.get('teamMembers')),
  ];

  actions.map((action) => dispatch(action));
};

export const fetchCurrentUser = async (dispatch: Dispatch) => {
  try {
    const { status, data } = await axios.get(`${USERS_URL}/current`);
    if (status === 200) {
      setData(data, dispatch);
    }
    // eslint-disable-next-line no-empty
  } catch (err) {
  } finally {
    dispatch(setLoading(false));
  }
};

interface FetchChangePassword {
  (password: string, token: string, history: RouterHistory): RootThunk
}

export const fetchChangePassword: FetchChangePassword = (password, token, history) => (
  async (dispatch) => {
    let notificationMessage: NotificationMessage;
    try {
      await axios.put(`${USERS_URL}/reset-password`, {
        token,
        password,
      });
      notificationMessage = passwordChangedSuccessfullyMessage;
      history.push('/signin');
    } catch (err) {
      notificationMessage = {
        content: err.response.data,
        severity: NotificationSeverity.ERROR,
      };
    } finally {
      dispatch(setNotification(notificationMessage));
    }
  }
);

interface FetchRequestPasswordRecovery {
  (requestBody: { email: string }, history: RouterHistory): RootThunk
}

export const fetchRequestPasswordRecovery: FetchRequestPasswordRecovery = (
  requestBody,
  history,
) => (
  async (dispatch) => {
    let notificationMessage: NotificationMessage;
    try {
      await axios.post(`${USERS_URL}/reset-password`, requestBody);
      notificationMessage = checkEmailForPasswordRecoveryLinkMessage;
      history.push('/');
    } catch (err) {
      notificationMessage = err?.response?.status === 401
        ? userWithGivenEmailDoesNotExistMessage
        : defaultErrorNotificationMessage;
    } finally {
      dispatch(setNotification(notificationMessage));
    }
  });
