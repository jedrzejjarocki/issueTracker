import axios from 'axios';
import {PROJECTS_URL} from '../../../api/commons';
import {setMessage} from '../ui/creators';
import {ADD_PROJECT, AddProjectAction, AddProjectPayload, SET_PROJECTS, SetProjectsAction,} from './types';
import {ProjectsState} from '../../reducers/project';
import {RootThunk} from '../../store';

export const addProject = (payload: AddProjectPayload): AddProjectAction => ({
  type: ADD_PROJECT,
  payload,
});

export const setProjects = (projects: ProjectsState): SetProjectsAction => ({
  type: SET_PROJECTS,
  payload: projects,
});

interface CreateProjectRequestBody {
  name: string
  projectKey: string
}

export const fetchCreateProject = (requestBody: CreateProjectRequestBody): RootThunk => async (dispatch) => {
  try {
    const { data } = await axios.post(PROJECTS_URL, requestBody);
    dispatch(addProject(data));
  } catch (err) {
    if (err.response.status <= 400) {
      dispatch(setMessage({
        content: 'Something went wrong, try again',
        severity: 'error',
      }));
    }
  }
};
