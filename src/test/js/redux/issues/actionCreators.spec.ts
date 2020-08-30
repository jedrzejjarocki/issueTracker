import axios from 'axios';
import { mocked } from 'ts-jest/utils';
import reactRouterDom from 'react-router-dom';
import thunk, { ThunkDispatch } from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Action } from 'redux';
import {
  fetchCreateIssue,
  fetchDeleteIssue,
  fetchUpdateIssue,
  IssueRequestBody,
} from '../../../../main/js/redux/issues/actionCreators';
import { IssueStatus, IssueType } from '../../../../main/js/redux/utilTypes';
import { ISSUES_URL } from '../../../../main/js/api/commons';
import {
  ADD_ISSUE, AddIssueAction, DELETE_ISSUE, UPDATE_ISSUE,
} from '../../../../main/js/redux/issues/types';
import Issue from '../../../../main/js/entities/Issue';
import {
  defaultErrorNotificationMessage,
  NotificationSeverity,
} from '../../../../main/js/redux/ui/NotificationMessage';
import { SET_NOTIFICATION } from '../../../../main/js/redux/ui/types';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

const { useHistory } = reactRouterDom;

const mockStore = configureStore<any, ThunkDispatch<any, any, Action<Promise<any>>>>([thunk]);

const requestBody: IssueRequestBody = {
  container: {
    id: 1,
    '@type': 'Backlog',
  },
  type: IssueType.TASK,
  status: IssueStatus.TO_DO,
  summary: '',
  description: '',
  assignee: null,
  storyPointsEstimate: 0,
};

const successResponseBody = {
  data: {
    ...requestBody,
    containerId: requestBody.container?.id || 0,
  },
};

afterEach(() => jest.clearAllMocks());

describe('issues actions creators', () => {
  describe('fetchCreateIssue', () => {
    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchCreateIssue(requestBody)).then(() => {
        expect(axios.post).toBeCalledWith(ISSUES_URL, requestBody);
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore({});
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchCreateIssue(requestBody)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;

        const expectedAction: AddIssueAction = {
          type: ADD_ISSUE,
          payload: new Issue({
            ...successResponseBody.data,
            assignee: successResponseBody.data.assignee?.id || null,
          }),
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
      });
    });

    it('should handle api call failure', () => {
      const { dispatch, getActions } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.reject());

      return dispatch(fetchCreateIssue(requestBody)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;

        const expectedAction = {
          type: SET_NOTIFICATION,
          payload: defaultErrorNotificationMessage,
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
      });
    });
  });

  describe('fetchUpdateIssue', () => {
    const projectId = 1;
    const successUpdateResponseBody = { data: { ...successResponseBody.data, id: 100 } };

    const failureResponseBody = {
      response: {
        data: {
          message: 'failure message',
        },
      },
    };

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      const history = useHistory();
      mocked(axios.put).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchUpdateIssue(requestBody, projectId, history)).then(() => {
        expect(axios.put).toBeCalledWith(ISSUES_URL, requestBody);
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore({});
      const history = useHistory();
      mocked(axios.put).mockImplementationOnce(() => Promise.resolve(successUpdateResponseBody));

      return dispatch(fetchUpdateIssue(requestBody, projectId, history)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;

        const expectedAction = {
          type: UPDATE_ISSUE,
          payload: new Issue({
            ...successUpdateResponseBody.data,
            assignee: successUpdateResponseBody.data.assignee?.id || null,
          }),
        };
        const expectedHistoryPushUrl = `/app/projects/${projectId}/board/issues/${successUpdateResponseBody.data.id}`;

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(history.push).toBeCalledWith(expectedHistoryPushUrl);
      });
    });

    it('should handle api call failure', () => {
      const { dispatch, getActions } = mockStore({});
      const history = useHistory();
      mocked(axios.put).mockImplementationOnce(() => Promise.reject(failureResponseBody));

      return dispatch(fetchUpdateIssue(requestBody, 0, history)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;

        const expectedAction = {
          type: SET_NOTIFICATION,
          payload: {
            content: failureResponseBody.response.data.message,
            severity: NotificationSeverity.ERROR,
          },
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(history.push).not.toBeCalled();
      });
    });
  });
  describe('fetch delete issue', () => {
    const issueId = 1;
    const containerId = 2;
    const projectId = 3;

    const successResponseBody = { status: 200 };
    const failureResponseBody = { status: 500 };

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      const history = useHistory();
      mocked(axios.delete).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchDeleteIssue(issueId, containerId, projectId, history)).then(() => {
        const url = `${ISSUES_URL}/${issueId}`;
        expect(axios.delete).toBeCalledWith(url);
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore({});
      const history = useHistory();
      mocked(axios.delete).mockImplementationOnce(() => Promise.resolve({ status: 200 }));

      return dispatch(fetchDeleteIssue(issueId, containerId, projectId, history)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const expectedAction = {
          type: DELETE_ISSUE,
          payload: { containerId, issueId },
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(history.push).toBeCalledWith(`/app/projects/${projectId}/board`);
      });
    });

    it('should handle api call failure', () => {
      const { dispatch, getActions } = mockStore({});

      mocked(axios.delete).mockImplementationOnce(() => Promise.resolve(failureResponseBody));
      const history = useHistory();

      return dispatch(fetchDeleteIssue(issueId, containerId, projectId, history)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const expectedAction = {
          type: SET_NOTIFICATION,
          payload: defaultErrorNotificationMessage,
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(history.push).not.toBeCalled();
      });
    });
  });
});
