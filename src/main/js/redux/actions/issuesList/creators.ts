import axios from 'axios';
import {SPRINTS_URL} from '../../../api/commons';
import {setMessage} from '../ui/creators';
import {IssuesListsState} from '../../reducers/issuesLists';
import {Sprint} from '../../../propTypes';
import {AddSprintAction, DeleteSprintAction, SetIssuesListAction, UpdateSprintAction,} from './types';
import {RouterHistory} from '../../utilTypes';
import {RootThunk} from '../../store';

export const SET_ISSUES_LISTS = 'SET_ISSUES_LISTS';
export const ADD_SPRINT = 'ADD_SPRINT';
export const UPDATE_SPRINT = 'UPDATE_SPRINT';
export const DELETE_SPRINT = 'DELETE_SPRINT';

export const setIssuesLists = (issuesLists: IssuesListsState): SetIssuesListAction => ({
  type: SET_ISSUES_LISTS,
  payload: issuesLists,
});

export const addSprint = (sprint: Sprint, projectId: number): AddSprintAction => ({
  type: ADD_SPRINT,
  payload: {
    projectId,
    sprint,
  },
});

export const updateSprint = (sprint: Sprint, projectId: number): UpdateSprintAction => ({
  type: UPDATE_SPRINT,
  payload: {
    sprint, projectId,
  },
});

export const deleteSprint = (sprint: Sprint, backlogId: number, projectId: number): DeleteSprintAction => ({
  type: DELETE_SPRINT,
  payload: {
    sprint, backlogId, projectId,
  },
});

export interface CreateSprintRequestBody {
  name: string
  goal: string
  project: {
    id: number
  }
  '@type': 'Sprint';
}

export const fetchCreateSprint = (requestBody: CreateSprintRequestBody, projectId: number): RootThunk => (
  async (dispatch) => {
    try {
      const { data } = await axios.post(SPRINTS_URL, requestBody);
      dispatch(addSprint(data, projectId));
    } catch (err) {
      if (err.response.status <= 400) {
        dispatch(setMessage({
          content: 'Something went wrong, try again',
          severity: 'error',
        }));
      }
    }
  }
);

export interface UpdateSprintRequestBody {
  id: number
  name: string
  goal: string
  project: {
    id: number,
  },
  ['@type']: 'Sprint'
  startDate?: number
  endDate?: number
}

export const fetchUpdateSprint = (requestBody: UpdateSprintRequestBody, projectId: number): RootThunk => (
  async (dispatch) => {
    try {
      const { data } = await axios.put(SPRINTS_URL, requestBody);
      dispatch(updateSprint(data, projectId));
    } catch (err) {
      if (err.response.status <= 400) {
        dispatch(setMessage({
          content: 'Something went wrong, try again',
          severity: 'error',
        }));
      }
    }
  }
);

export const fetchDeleteSprint = (sprint: Sprint, backlogId: number, projectId: number, history: RouterHistory): RootThunk => (
  async (dispatch) => {
    const { status } = await axios.delete(`${SPRINTS_URL}/${sprint.id}`);
    if (status === 200) {
      dispatch(deleteSprint(sprint, backlogId, projectId));
      history.push(`/app/projects/${projectId}/board`);
    }
  }
);
