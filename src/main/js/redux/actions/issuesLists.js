import axios from 'axios';
import {SPRINTS_URL} from '../../api/commons';
import {setMessage} from './ui';

export const SET_ISSUES_LISTS = 'SET_ISSUES_LISTS';
export const ADD_SPRINT = 'ADD_SPRINT';
export const UPDATE_SPRINT = 'UPDATE_SPRINT';
export const DELETE_SPRINT = 'DELETE_SPRINT';

export const setIssuesLists = (issuesLists) => ({
  type: SET_ISSUES_LISTS,
  payload: issuesLists,
});

export const addSprint = (sprint, projectId) => ({
  type: ADD_SPRINT,
  payload: {
    projectId,
    sprint,
  },
});

export const createSprint = (request, projectId) => async (dispatch) => {
  try {
    const { data } = await axios.post(SPRINTS_URL, request);
    dispatch(addSprint(data, projectId));
  } catch (err) {
    if (err.response.status <= 400) {
      dispatch(setMessage('Something went wrong, try again', 'error'));
    }
  }
};

export const deleteSprint = (sprint, backlogId, projectId) => ({
  type: DELETE_SPRINT,
  payload: {
    sprint, backlogId, projectId,
  },
});

export const fetchDeleteSprint = (sprint, backlogId, projectId, history) => async (dispatch) => {
  const { status } = await axios.delete(`${SPRINTS_URL}/${sprint.id}`);
  if (status === 200) {
    dispatch(deleteSprint(sprint, backlogId, projectId));
    history.push(`/app/projects/${projectId}/board`);
  }
};

export const updateSprint = (sprint, projectId) => ({
  type: UPDATE_SPRINT,
  payload: {
    sprint, projectId,
  },
});

export const fetchUpdateSprint = (requestBody, projectId) => async (dispatch) => {
  try {
    const { data } = await axios.put(SPRINTS_URL, requestBody);
    dispatch(updateSprint(data, projectId));
  } catch (err) {
    if (err.response.status <= 400) {
      dispatch(setMessage('Something went wrong, try again', 'error'));
    }
  }
};
