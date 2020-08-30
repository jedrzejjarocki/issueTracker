/* eslint-disable arrow-body-style */
import axios from 'axios';
import { Dispatch } from 'redux';
import React from 'react';
import { fromJS, isKeyed, Map } from 'immutable';
import { LOGIN_URL, LOGOUT_URL, USERS_URL } from '../../api/commons';
import { setLoading, setNotification } from '../ui/actionCreators';
import normalize from '../schema';
import { setProjects } from '../projects/actionCreators';
import { setIssuesContainers } from '../issuesContainers/actionCreators';
import { setIssues } from '../issues/actionCreators';
import { setTeamMembers } from '../teamMembers/actionCreators';
import { RouterHistory, UserRole } from '../utilTypes';
import { RootThunk } from '../store';
import User from '../../entities/User';
import {
  accountCreatedMessage,
  checkEmailForPasswordRecoveryLinkMessage,
  defaultErrorNotificationMessage,
  incorrectUsernameOrPasswordMessage,
  NotificationSeverity,
  passwordChangedSuccessfullyMessage,
  userWithGivenEmailDoesNotExistMessage,
} from '../ui/NotificationMessage';
import { SetUserAction } from './types';
import Project from '../../entities/Project';
import { ProjectsState } from '../projects/types';
import Issue from '../../entities/Issue';
import TeamMember from '../../entities/TeamMember';
import Backlog from '../../entities/Backlog';
import Sprint from '../../entities/Sprint';
import { IssuesContainersState } from '../issuesContainers/types';
import { IssuesState } from '../issues/types';

export const SET_USER = 'SET_USER';

export const setUser = (user: User | null): SetUserAction => ({
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
    dispatch(setUser(new User(data)));
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
  (
    requestBody: RegisterRequestBody,
    toggleFormDialog: () => void,
    setResponseError: React.Dispatch<any>,
    token?: string
  ): RootThunk
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
  containerId: number
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

const parseUser = (usersData: any): User => new User(fromJS(usersData).first());
const parseProjects = (projectsData: any): ProjectsState => {
  return fromJS(projectsData, (key, value) => {
    if (isKeyed(value)) {
      return key ? new Project(value) : value.toMap();
    }
    return value.toList();
  });
};

const parseIssues = (issuesData: any) => {
  return fromJS(issuesData, (key, value) => {
    if (isKeyed(value)) {
      return key ? new Issue(value) : value.toMap();
    }
    return value.toList();
  }) || Map();
};

const parseTeamMembers = (teamMembersData: any) => {
  return fromJS(teamMembersData, (key, value) => {
    if (isKeyed(value)) {
      return key ? new TeamMember(value) : value.toMap();
    }
    return value.toList();
  });
};

const parseIssuesContainers = (issuesContainersData: any) => {
  return fromJS(issuesContainersData, (key, value) => {
    if (isKeyed(value)) {
      if (!key) return value.toMap();
      return (<Sprint> value.toJS()).name === undefined
        ? new Backlog(value)
        : new Sprint(value);
    }
    return value.toList();
  });
};

const sortIssuesListsByPriority = (
  containers: IssuesContainersState,
  issues: IssuesState,
): IssuesContainersState => {
  return containers.mapEntries(([key, container]) => {
    const value = container.updateIn(['issues'], (ids) => {
      return ids
        .map((id: number) => issues.get(`${id}`))
        .sort((a: Issue, b: Issue) => b.priority - a.priority)
        .map(({ id }: Issue) => id);
    });
    return [key, value];
  });
};

const setData = (responseBody: CurrentUserResponseBody, dispatch: Dispatch) => {
  const normalized = normalize(responseBody);

  const user = parseUser(normalized.user);
  const projects = parseProjects(normalized.projects);
  const issues = parseIssues(normalized.issues);
  const teamMembers = parseTeamMembers(normalized.teamMembers);
  const issuesContainers = sortIssuesListsByPriority(parseIssuesContainers(normalized.issuesLists), issues);

  const actions = [
    setUser(user),
    setProjects(projects),
    setIssues(issues),
    setIssuesContainers(issuesContainers),
    setTeamMembers(teamMembers),
  ];

  actions.map((action) => dispatch(action));
};

export const fetchCurrentUser = async (dispatch: Dispatch) => {
  try {
    const { status, data } = await axios.get(`${USERS_URL}/current`);
    if (status === 200) setData(data, dispatch);
  } finally {
    dispatch(setLoading(false));
  }
};

interface FetchChangePassword {
  (password: string, token: string, history: RouterHistory): RootThunk
}

export const fetchChangePassword: FetchChangePassword = (password, token, history) => (
  async (dispatch) => {
    try {
      await axios.put(`${USERS_URL}/reset-password`, {
        token,
        password,
      });
      dispatch(setNotification(passwordChangedSuccessfullyMessage));
      history.push('/signin');
    } catch (err) {
      dispatch(setNotification({
        content: err.response.data,
        severity: NotificationSeverity.ERROR,
      }));
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
    try {
      await axios.post(`${USERS_URL}/reset-password`, requestBody);
      dispatch(setNotification(checkEmailForPasswordRecoveryLinkMessage));
      history.push('/');
    } catch (err) {
      dispatch(setNotification(err?.response?.status === 401
        ? userWithGivenEmailDoesNotExistMessage
        : defaultErrorNotificationMessage));
    }
  });
