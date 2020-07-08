import axios from 'axios';
import {BASE_URL, LOGIN_URL, LOGOUT_URL, USERS_URL} from '../../../api/commons';
import {setLoading, setMessage} from '../ui/creators';
import normalize from '../../schema';
import {setProjects} from '../project/creators';
import {setIssuesLists} from '../issuesList/creators';
import {setIssues} from '../issue/creators';
import {setTeamMembers} from '../teamMember/creators';
import {SetUserAction} from "./types";
import {User, UserRole} from "../../../propTypes";
import {Dispatch} from "redux";
import {RouterHistory} from "../../utilTypes";
import {RootThunk} from "../../store";
import React from "react";

export const SET_USER = 'SET_USER';

export const setUser = (user: User): SetUserAction => ({
  type: SET_USER,
  payload: user,
});

interface Credentials {
  username: string
  password: string
}

export const fetchLogin = (credentials: Credentials): RootThunk => async (dispatch) => {
  try {
    const { data } = await axios.post(LOGIN_URL, credentials);
    const { id, username } = data;
    dispatch(setUser({ id, username }));
  } catch (error) {
    dispatch(setMessage({
      content: 'Incorrect username or password',
      severity: 'error'
    }));
  }
};

export interface RegisterRequestBody {
  username: string
  password: string
  email: string
}

export const fetchRegister = (requestBody: RegisterRequestBody, token: string, toggleFormDialog: () => void, setResponseError: React.Dispatch<any>): RootThunk => (
  async (dispatch) => {
    try {
      const params = token ? `?token=${token}` : '';
      const { status } = await axios.post(USERS_URL + params, requestBody);

      if (status === 201) {
        dispatch(setMessage({
          content: 'Account created!',
          severity: 'success'
          })
        );
        toggleFormDialog();
      }
    } catch (err) {
      setResponseError(err.response.data.message);
    }
  }
);

export interface FetchLogoutFunc {
  (): (dispatch: Dispatch) => Promise<void>
}

export const fetchLogout: FetchLogoutFunc = () => async (dispatch) => {
  const { status } = await axios.post(LOGOUT_URL);
  if (status === 200) dispatch(setUser(null));
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
  const {
    user,
    projects,
    issues,
    teamMembers,
    issuesLists,
  } = normalize(responseBody);

  const actions = [
    setUser(Object.values(user)[0]),
    setProjects(projects),
    setIssues(issues),
    setIssuesLists(issuesLists),
    setTeamMembers(teamMembers),
  ];

  actions.map((action) => dispatch(action));
};

export const fetchCurrentUser = async (dispatch: Dispatch) => {
  try {
    const { status, data } = await axios.get(`${BASE_URL}/users/current`);
    if (status === 200) {
      setData(data, dispatch);
    }
    dispatch(setLoading(false));
  } catch (e) {
    dispatch(setLoading(false));
  }
};

export const fetchChangePassword = (password: string, token: string, history: RouterHistory): RootThunk => (
  async (dispatch) => {
    try {
      await axios.put(`${USERS_URL}/reset-password`, {
        token,
        password,
      });
      dispatch(setMessage({
          content: 'Password changed successfully',
          severity: 'success'
        })
      );
      history.push('/signin');
    } catch (err) {
      dispatch(setMessage({
          content: err.response.data,
          severity: 'error'
        })
      );
    }
  }
);

export const fetchRequestPasswordRecovery = (credentials: { email: string }, history: RouterHistory): RootThunk => (
  async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/users/reset-password`, credentials);
    dispatch(setMessage({
        content: 'Check your email for password recovery link',
        severity: 'success'
      })
    );
    history.push('/');
  } catch (err) {
    if (err.response.status === 401) {
      dispatch(setMessage({
          content: "User with a given email does't exists",
          severity: 'error'
        })
      );
    }
  }
});
