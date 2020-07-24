import axios from 'axios';
import {List} from 'immutable';
import {SPRINTS_URL} from '../../api/commons';
import {setNotification} from '../ui/actionCreators';
import {RouterHistory} from '../utilTypes';
import {RootThunk} from '../store';
import Sprint from '../../entities/Sprint';
import {
  ADD_SPRINT,
  AddSprintAction,
  DELETE_SPRINT,
  DeleteSprintAction,
  IssuesContainersState,
  SET_ISSUES_CONTAINERS,
  SetIssuesContainersAction,
  UPDATE_SPRINT,
  UpdateSprintAction,
} from './types';
import {IssuesContainer} from '../../entities/IssuesContainer';
import {defaultErrorNotificationMessage} from '../ui/NotificationMessage';

export const setIssuesContainers = (issuesContainers: IssuesContainersState): SetIssuesContainersAction => ({
  type: SET_ISSUES_CONTAINERS,
  payload: issuesContainers,
});

export const addSprint = (sprint: Sprint, projectId: number): AddSprintAction => ({
  type: ADD_SPRINT,
  payload: {
    projectId,
    sprint: sprint as IssuesContainer,
  },
});

export const updateSprint = (sprint: Sprint, projectId: number): UpdateSprintAction => ({
  type: UPDATE_SPRINT,
  payload: {
    projectId,
    sprint: sprint as IssuesContainer,
  },
});

export const deleteSprint = (sprint: Sprint, backlogId: number, projectId: number): DeleteSprintAction => ({
  type: DELETE_SPRINT,
  payload: {
    projectId,
    backlogId,
    sprint: sprint as IssuesContainer,
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

interface FetchCreateSprint {
  (requestBody: CreateSprintRequestBody): RootThunk
}

export const fetchCreateSprint: FetchCreateSprint = (requestBody) => (
  async (dispatch) => {
    try {
      const { data } = await axios.post(SPRINTS_URL, requestBody);
      const sprint = new Sprint({ ...data, issues: List([]) });
      dispatch(addSprint(sprint, requestBody.project.id));
    } catch (err) {
      dispatch(setNotification(defaultErrorNotificationMessage));
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
  '@type': 'Sprint'
  startDate?: string
  endDate?: string
}

interface FetchUpdateSprint {
  (requestBody: UpdateSprintRequestBody): RootThunk
}

export const fetchUpdateSprint: FetchUpdateSprint = (requestBody) => (
  async (dispatch) => {
    try {
      alert(JSON.stringify(requestBody, null, 4));
      const { data } = await axios.put(SPRINTS_URL, requestBody);
      const updatedSprint = new Sprint({ ...data, issues: List(data.issues.map(({ id }: { id: number}) => id)) });
      dispatch(updateSprint(updatedSprint, requestBody.project.id));
    } catch (err) {
      dispatch(setNotification(defaultErrorNotificationMessage));
    }
  }
);

interface FetchDeleteSprint {
  (sprint: Sprint, backlogId: number, projectId: number, history: RouterHistory): RootThunk
}

export const fetchDeleteSprint: FetchDeleteSprint = (sprint, backlogId, projectId, history) => (
  async (dispatch) => {
    try {
      const { status } = await axios.delete(`${SPRINTS_URL}/${sprint.id}`);
      if (status !== 200) throw new Error();

      dispatch(deleteSprint(sprint, backlogId, projectId));
      history.push(`/app/projects/${projectId}/board`);
    } catch (err) {
      dispatch(setNotification(defaultErrorNotificationMessage));
    }
  }
);
