import axios from 'axios';
import thunk, {ThunkDispatch} from 'redux-thunk';
import configureStore from 'redux-mock-store';
import {Action} from 'redux';
import {mocked} from 'ts-jest/utils';
import {CreateProjectRequestBody, fetchCreateProject} from '../../../../main/js/redux/projects/actionCreators';
import {PROJECTS_URL} from '../../../../main/js/api/commons';
import {ADD_PROJECT} from '../../../../main/js/redux/projects/types';
import {SET_NOTIFICATION} from '../../../../main/js/redux/ui/reducer';
import {defaultErrorNotificationMessage} from '../../../../main/js/redux/ui/NotificationMessage';

jest.mock('axios');

const mockStore = configureStore<any, ThunkDispatch<any, any, Action<Promise<any>>>>([thunk]);

afterEach(() => jest.clearAllMocks());

describe('projects action creators', () => {
  describe('fetchCreateProject', () => {
    const requestBody: CreateProjectRequestBody = {
      name: 'name',
      projectKey: 'key',
    };

    const successResponseBody = { data: { ...requestBody, id: 1 } };

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchCreateProject(requestBody)).then(() => {
        const url = PROJECTS_URL;
        expect(mocked(axios.post)).toBeCalledWith(url, requestBody);
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore({});
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchCreateProject(requestBody)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;

        const expectedAction = {
          type: ADD_PROJECT,
          payload: successResponseBody.data,
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
      });
    });

    it('should handle api call failure', () => {
      const { dispatch, getActions } = mockStore({});
      mocked(axios.post).mockImplementationOnce(() => Promise.reject());

      return dispatch(fetchCreateProject(requestBody)).then(() => {
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
