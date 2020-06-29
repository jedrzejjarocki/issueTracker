import axios from 'axios';
import {BASE_URL, LOGIN_URL, LOGOUT_URL, USERS_URL,} from '../../api/commons';
import {setLoading, setMessage} from './ui';
import normalize from '../schema';
import {setProjects} from './project';
import {setIssuesLists} from './issuesLists';
import {setIssues} from './issue';
import {setTeamMembers} from './teamMember';

export const SET_USER = 'SET_USER';

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const logout = () => async (dispatch) => {
  const { status } = await axios.post(LOGOUT_URL);
  if (status === 200) dispatch(setUser(null));
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post(LOGIN_URL, credentials);
    const { id, username } = data;
    dispatch(setUser({ id, username }));
  } catch (error) {
    dispatch(setMessage('Incorrect username or password', 'error'));
  }
};

export const register = (user, token, toggleFormDialog) => (
  async (dispatch) => {
    try {
      const params = token ? `?token=${token}` : '';
      const { status } = await axios.post(USERS_URL + params, user);

      if (status === 201) {
        dispatch(setMessage('Account created!', 'success'));
        toggleFormDialog();
      }
    } catch (err) {
      dispatch(setMessage(err.response.data.message, 'error'));
    }
  }
);

const setData = (data, dispatch) => {
  const {
    user,
    projects,
    issues,
    teamMembers,
    issuesLists,
  } = normalize(data);

  const actions = [
    setUser(Object.values(user)[0]),
    setProjects(projects),
    setIssues(issues),
    setIssuesLists(issuesLists),
    setTeamMembers(teamMembers),
  ];

  actions.map((action) => dispatch(action));
};

export const fetchCurrentUser = async (dispatch) => {
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

export const changePassword = (password, token, history) => async (dispatch) => {
  try {
    await axios.put(`${USERS_URL}/reset-password`, {
      token,
      password,
    });
    dispatch(setMessage('Password changed successfully', 'success'));
    history.push('/signin');
  } catch (err) {
    dispatch(setMessage(err.response.data, 'error'));
  }
};

export const requestPasswordRecovery = (credentials, history) => async (dispatch) => {
  try {
    await axios.post(`${BASE_URL}/users/reset-password`, credentials);
    dispatch(setMessage('Check your email for password recovery link', 'success'));
    history.push('/');
  } catch (err) {
    if (err.response.status === 401) {
      dispatch(setMessage("User with a given email does't exists", 'error'));
    }
  }
};
