import axios from 'axios';
import {BASE_URL, ISSUES_URL} from '../../api/commons';
import {setMessage} from './ui';

export const ADD_ISSUE = 'ADD_ISSUE';
export const SET_ISSUES = 'SET_ISSUES';
export const UPDATE_ISSUE = 'UPDATE_ISSUE';
export const DELETE_ISSUE = 'DELETE_ISSUE';

const addIssue = (issue) => ({
  type: ADD_ISSUE,
  payload: issue,
});

export const setIssues = (issues) => ({
  type: SET_ISSUES,
  payload: issues,
});

export const createIssue = (request) => async (dispatch) => {
  const { data } = await axios.post(ISSUES_URL, request);

  const issueData = { ...data };
  issueData.assignee = data.assignee ? data.assignee.id : null;

  dispatch(addIssue(issueData));
};

const updateIssue = (issue) => ({
  type: UPDATE_ISSUE,
  payload: issue,
});

export const fetchUpdateIssue = (request, projectId, history) => async (dispatch) => {
  try {
    const { data } = await axios.put(`${BASE_URL}/issues`, request);
    const issueData = { ...data };
    issueData.assignee = data.assignee ? data.assignee.id : null;
    dispatch(updateIssue(issueData));
    history.push(`/app/projects/${projectId}/board/issues/${data.id}`);
  } catch (err) {
    dispatch(setMessage(err.response.data.message, 'error'));
  }
};

export const deleteIssue = (issueId, listId) => ({
  type: DELETE_ISSUE,
  payload: {
    listId,
    issueId,
  },
});

export const fetchDeleteIssue = (id, listId, projectId, history) => async (dispatch) => {
  const { status } = await axios.delete(`${ISSUES_URL}/${id}`);
  if (status === 200) {
    dispatch(deleteIssue(id, listId));
    history.push(`/app/projects/${projectId}/board`);
  }
};
