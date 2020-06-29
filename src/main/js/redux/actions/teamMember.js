import axios from 'axios';
import {TEAM_MEMBERS_URL} from '../../api/commons';
import {setMessage} from './ui';

export const SET_TEAM_MEMBERS = 'SET_TEAM_MEMBERS';
export const UPDATE_MEMBER_ROLE = 'UPDATE_MEMBER_ROLE';
export const DELETE_MEMBER = 'DELETE_MEMBER';
export const ADD_MEMBER = 'ADD_MEMBER';

export const setTeamMembers = (members) => ({
  type: SET_TEAM_MEMBERS,
  payload: members,
});

export const addMember = (member) => ({
  type: ADD_MEMBER,
  payload: member,
});

export const fetchAddTeamMember = (requestBody, username, history) => async (dispatch) => {
  const { data } = await axios.post(TEAM_MEMBERS_URL, requestBody);
  const payload = { ...data, username };
  dispatch(addMember(payload));
  dispatch(setMessage('Team member successfully added', 'success'));
  history.push('/app/people');
};

export const inviteUser = (requestBody) => async (dispatch) => {
  try {
    await axios.post(`${TEAM_MEMBERS_URL}/invitations`, requestBody);
    dispatch(setMessage('User has been invited', 'success'));
  } catch (err) {
    dispatch(setMessage('Something went wrong, try again', 'error'));
  }
};

const updateMemberRole = (payload) => ({
  type: UPDATE_MEMBER_ROLE,
  payload,
});

export const changeRole = (requestBody, toggleDialog) => async (dispatch) => {
  try {
    const { data } = await axios.put(TEAM_MEMBERS_URL, requestBody);
    dispatch(updateMemberRole(data));
  } catch (err) {
    dispatch(setMessage(err.response.data.message, 'error'));
  }
  toggleDialog();
};

export const deleteMember = (projectId, memberId) => ({
  type: DELETE_MEMBER,
  payload: {
    projectId, memberId,
  },
});

export const fetchDeleteMember = (projectId, memberId, history, toggleDialog) => async (dispatch) => {
  try {
    const { status } = await axios.delete(`${TEAM_MEMBERS_URL}/${memberId}`);
    if (status === 200) {
      dispatch(deleteMember(projectId, memberId));
      history.push(`/app/projects/${projectId}/team`);
    }
  } catch (err) {
    if (err.response.status === 409) {
      dispatch(setMessage(err.response.data.message, 'error'));
    }
  }
  toggleDialog();
};
