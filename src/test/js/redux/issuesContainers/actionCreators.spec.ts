import axios from 'axios';
import { mocked } from 'ts-jest/utils';
import reactRouterDom from 'react-router-dom';
import thunk, { ThunkDispatch } from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Action } from 'redux';
import { List } from 'immutable';
import {
  CreateSprintRequestBody,
  fetchCreateSprint,
  fetchDeleteSprint,
  fetchUpdateSprint,
  UpdateSprintRequestBody,
} from '../../../../main/js/redux/issuesContainers/actionCreators';
import Sprint, { SprintStatus } from '../../../../main/js/entities/Sprint';
import { SPRINTS_URL } from '../../../../main/js/api/commons';
import {
  ADD_SPRINT,
  AddSprintAction,
  DELETE_SPRINT,
  UPDATE_SPRINT,
} from '../../../../main/js/redux/issuesContainers/types';
import { IssuesContainer } from '../../../../main/js/entities/IssuesContainer';
import { defaultErrorNotificationMessage } from '../../../../main/js/redux/ui/NotificationMessage';
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

afterEach(() => jest.clearAllMocks());

describe('issue containers action creators', () => {
  describe('fetchCreateSprint', () => {
    const requestBody: CreateSprintRequestBody = {
      name: 'name',
      goal: 'goal',
      project: {
        id: 1,
      },
      '@type': 'Sprint',
    };

    const successResponseBody = { data: { id: 1, ...requestBody } };

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchCreateSprint(requestBody)).then(() => {
        expect(mocked(axios.post)).toBeCalledWith(SPRINTS_URL, requestBody);
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore({});
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchCreateSprint(requestBody)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;

        const expectedAction: AddSprintAction = {
          type: ADD_SPRINT,
          payload: {
            projectId: requestBody.project.id,
            sprint: new Sprint(successResponseBody.data) as IssuesContainer,
          },
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
      });
    });

    it('should handle api call failure', () => {
      mocked(axios.post).mockImplementationOnce(() => Promise.reject());
      const { dispatch, getActions } = mockStore({});

      return dispatch(fetchCreateSprint(requestBody)).then(() => {
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

  describe('fetchUpdateSprint', () => {
    const requestBody: UpdateSprintRequestBody = {
      id: 1,
      name: 'name',
      goal: 'goal',
      project: {
        id: 1,
      },
      '@type': 'Sprint',
      startDate: '',
      endDate: '',
      status: SprintStatus.PLANNED,
    };

    const successResponseBody = { data: { ...requestBody, issues: [{ id: 1 }, { id: 2 }] } };

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      mocked(axios.put).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchUpdateSprint(requestBody)).then(() => {
        expect(mocked(axios.put)).toBeCalledWith(SPRINTS_URL, requestBody);
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore({});
      mocked(axios.put).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchUpdateSprint(requestBody)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;

        const expectedAction = {
          type: UPDATE_SPRINT,
          payload: {
            projectId: requestBody.project.id,
            sprint: new Sprint({
              ...successResponseBody.data,
              issues: List(successResponseBody.data.issues.map(({ id }) => id)),
            }),
          },
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
      });
    });

    it('should handle api call failure', () => {
      mocked(axios.put).mockImplementationOnce(() => Promise.reject());
      const { dispatch, getActions } = mockStore({});

      return dispatch(fetchUpdateSprint(requestBody)).then(() => {
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

  describe('fetchDeleteSprint', () => {
    const successResponseBody = { status: 200 };
    const sprint = new Sprint({ id: 1 });
    const backlogId = 2;
    const projectId = 3;

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      const history = useHistory();

      mocked(axios.put).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchDeleteSprint(sprint, backlogId, projectId, history)).then(() => {
        const url = `${SPRINTS_URL}/${sprint.id}`;
        expect(mocked(axios.delete)).toBeCalledWith(url);
      });
    });

    it('should handle api call success', () => {
      mocked(axios.delete).mockImplementationOnce(() => Promise.resolve(successResponseBody));
      const { dispatch, getActions } = mockStore({});
      const history = useHistory();

      return dispatch(fetchDeleteSprint(sprint, backlogId, projectId, history)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;

        const expectedAction = {
          type: DELETE_SPRINT,
          payload: {
            projectId,
            backlogId,
            sprint,
          },
        };

        const expectedHistoryPushUrl = `/app/projects/${projectId}/board`;

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(history.push).toBeCalledWith(expectedHistoryPushUrl);
      });
    });

    it('should handle api call failure', () => {
      mocked(axios.delete).mockImplementationOnce(() => Promise.reject());
      const { dispatch, getActions } = mockStore({});
      const history = useHistory();

      return dispatch(fetchDeleteSprint(sprint, backlogId, projectId, history)).then(() => {
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
});
