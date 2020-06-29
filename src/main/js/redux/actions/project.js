import axios from 'axios';
import {PROJECTS_URL} from '../../api/commons';
import {setMessage} from './ui';

export const SET_PROJECTS = 'SET_PROJECTS';
export const ADD_PROJECT = 'ADD_PROJECT';

const addProject = (project) => ({
  type: ADD_PROJECT,
  payload: project,
});

export const setProjects = (projects) => ({
  type: SET_PROJECTS,
  payload: projects,
});

export const createProject = (name, projectKey) => async (dispatch) => {
  try {
    const { data } = await axios.post(PROJECTS_URL, {
      name,
      projectKey,
    });
    dispatch(addProject(data));
  } catch (err) {
    if (err.response.status <= 400) {
      dispatch(setMessage('Something went wrong, try again', 'error'));
    }
  }
};
