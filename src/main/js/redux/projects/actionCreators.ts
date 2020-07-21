import axios from 'axios';
import {PROJECTS_URL} from '../../api/commons';
import {setNotification} from '../ui/actionCreators';
import {RootThunk} from '../store';
import {
  ADD_PROJECT,
  AddProjectAction,
  AddProjectPayload,
  ProjectsState,
  SET_PROJECTS,
  SetProjectsAction,
} from './types';
import {defaultErrorNotificationMessage} from '../ui/NotificationMessage';

export const addProject = (payload: AddProjectPayload): AddProjectAction => ({
  type: ADD_PROJECT,
  payload,
});

export const setProjects = (projects: ProjectsState): SetProjectsAction => ({
  type: SET_PROJECTS,
  payload: projects,
});

export interface CreateProjectRequestBody {
  name: string
  projectKey: string
}

interface FetchCreateProject {
  (requestBody: CreateProjectRequestBody): RootThunk
}

export const fetchCreateProject: FetchCreateProject = (requestBody) => async (dispatch) => {
  try {
    const { data } = await axios.post(PROJECTS_URL, requestBody);
    dispatch(addProject(data));
  } catch (err) {
    dispatch(setNotification(defaultErrorNotificationMessage));
  }
};
