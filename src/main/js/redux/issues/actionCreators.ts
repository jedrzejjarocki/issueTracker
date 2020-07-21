import axios from 'axios';
import {ISSUES_URL} from '../../api/commons';
import {setNotification} from '../ui/actionCreators';
import {IssueStatus, IssueType, RouterHistory} from '../utilTypes';
import {RootThunk} from '../store';
import Issue from '../../entities/Issue';
import {
  ADD_ISSUE,
  AddIssueAction,
  DELETE_ISSUE,
  DeleteIssueAction,
  IssuesState,
  SET_ISSUES,
  SetIssuesAction,
  UPDATE_ISSUE,
  UpdateIssueAction,
} from './types';
import {defaultErrorNotificationMessage, NotificationSeverity} from '../ui/NotificationMessage';

export interface IssueRequestBody {
  id?: number
  container: {
    id: number
    '@type': 'Backlog' | 'Sprint'
  }
  version?: number
  type: IssueType
  status: IssueStatus
  summary: string
  description: string
  assignee: { id: number } | null
  storyPointsEstimate: number
}

export const setIssues = (issues: IssuesState): SetIssuesAction => ({
  type: SET_ISSUES,
  payload: issues,
});

export const addIssue = (issue: Issue): AddIssueAction => ({
  type: ADD_ISSUE,
  payload: issue,
});

export const updateIssue = (issue: Issue): UpdateIssueAction => ({
  type: UPDATE_ISSUE,
  payload: issue,
});

export const deleteIssue = (issueId: number, containerId: number): DeleteIssueAction => ({
  type: DELETE_ISSUE,
  payload: {
    containerId,
    issueId,
  },
});

export const fetchCreateIssue = (requestBody: IssueRequestBody): RootThunk => async (dispatch) => {
  try {
    const { data } = await axios.post(ISSUES_URL, requestBody);
    dispatch(addIssue(new Issue({
      ...data,
      assignee: data.assignee?.id || null,
    })));
  } catch (err) {
    dispatch(setNotification(defaultErrorNotificationMessage));
  }
};

export const fetchUpdateIssue = (requestBody: IssueRequestBody, projectId: number, history: RouterHistory): RootThunk => (
  async (dispatch) => {
    try {
      const { data } = await axios.put(ISSUES_URL, requestBody);
      history.push(`/app/projects/${projectId}/board/issues/${data.id}`);
      dispatch(updateIssue(new Issue({
        ...data,
        assignee: data.assignee?.id || null,
      })));
    } catch (err) {
      dispatch(setNotification({
        content: err.response.data.message,
        severity: NotificationSeverity.ERROR,
      }));
    }
  }
);

export const fetchDeleteIssue = (id: number, containerId: number, projectId: number, history: RouterHistory): RootThunk => (
  async (dispatch) => {
    try {
      const { status } = await axios.delete(`${ISSUES_URL}/${id}`);
      if (status !== 200) throw new Error();

      history.push(`/app/projects/${projectId}/board`);
      dispatch(deleteIssue(id, containerId));
    } catch (err) {
      dispatch(setNotification(defaultErrorNotificationMessage));
    }
  }
);
