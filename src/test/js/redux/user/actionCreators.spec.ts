import {mocked} from 'ts-jest/utils';
import reactRouterDom from 'react-router-dom';
import thunk, {ThunkDispatch} from 'redux-thunk';
import configureStore from 'redux-mock-store';
import {Action} from 'redux';
import axios from 'axios';
import {
  fetchChangePassword,
  fetchCurrentUser,
  fetchLogin,
  fetchLogout,
  fetchRegister,
  fetchRequestPasswordRecovery,
  LoginRequestBody,
  RegisterRequestBody,
} from '../../../../main/js/redux/user/actionCreators';
import {LOGIN_URL, LOGOUT_URL, USERS_URL} from '../../../../main/js/api/commons';
import {User} from '../../../../main/js/entities/User';
import {SET_USER, SetUserAction} from '../../../../main/js/redux/user/reducer';
import {SET_LOADING, SET_NOTIFICATION} from '../../../../main/js/redux/ui/reducer';
import {
  accountCreatedMessage,
  checkEmailForPasswordRecoveryLinkMessage,
  defaultErrorNotificationMessage,
  incorrectUsernameOrPasswordMessage,
  NotificationSeverity,
  passwordChangedSuccessfullyMessage,
  userWithGivenEmailDoesNotExistMessage,
} from '../../../../main/js/redux/ui/NotificationMessage';
import {SET_PROJECTS} from '../../../../main/js/redux/projects/types';
import {SET_ISSUES} from '../../../../main/js/redux/issues/types';
import {SET_ISSUES_CONTAINERS} from '../../../../main/js/redux/issuesContainers/types';
import {SET_TEAM_MEMBERS} from '../../../../main/js/redux/teamMembers/types';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));
const setResponseError = jest.fn();
const toggleFormDialog = jest.fn();

const mockStore = configureStore<any, ThunkDispatch<any, any, Action<Promise<any>>>>([thunk]);

const { useHistory } = reactRouterDom;

afterEach(() => jest.clearAllMocks());

describe('user action creators', () => {
  describe('fetchLogin', () => {
    const requestBody: LoginRequestBody = {
      username: 'username',
      password: 'password',
    };

    const successResponseBody = {
      data: {
        id: 1,
        username: 'username',
      },
    };

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve());

      return dispatch(fetchLogin(requestBody)).then(() => {
        expect(axios.post).toBeCalledWith(LOGIN_URL, requestBody);
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchLogin(requestBody)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const expectedAction = {
          type: SET_USER,
          payload: new User(successResponseBody.data),
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
      });
    });

    it.each([
      [401, incorrectUsernameOrPasswordMessage],
      [500, defaultErrorNotificationMessage],
    ])('should handle api call failure, status: %s, message: %s', (status, message) => {
      const { dispatch, getActions } = mockStore();
      // eslint-disable-next-line prefer-promise-reject-errors
      mocked(axios.post).mockImplementationOnce(() => Promise.reject({
        response: {
          status,
        },
      }));

      return dispatch(fetchLogin(requestBody)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const expectedAction = {
          type: SET_NOTIFICATION,
          payload: message,
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
      });
    });
  });

  describe('fetchRegister', () => {
    const requestBody: RegisterRequestBody = {
      username: 'username',
      password: 'password',
      email: 'email@email.com',
    };

    it.each([
      ['123', `${USERS_URL}?token=123`],
      [undefined, USERS_URL],
    ])('should call api with proper arguments, token: %s, url: %s)', (token, url) => {
      const { dispatch } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve());

      return dispatch(fetchRegister(requestBody, toggleFormDialog, setResponseError, token))
        .then(() => expect(axios.post).toBeCalledWith(url, requestBody));
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve({ status: 201 }));

      return dispatch(fetchRegister(requestBody, toggleFormDialog, setResponseError)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const expectedAction = {
          type: SET_NOTIFICATION,
          payload: accountCreatedMessage,
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(toggleFormDialog).toBeCalled();
      });
    });

    it.each([
      [undefined, { type: SET_NOTIFICATION, payload: defaultErrorNotificationMessage }, 1],
      ['user exists', undefined, 0],
    ])('should handle api call failure', (
      failureResponseMessage,
      expectedAction,
      expectedNumOfActions,
    ) => {
      const { dispatch, getActions } = mockStore();
      // eslint-disable-next-line prefer-promise-reject-errors
      mocked(axios.post).mockImplementationOnce(() => Promise.reject({
        response: {
          data: {
            message: failureResponseMessage,
          },
        },
      }));

      return dispatch(fetchRegister(requestBody, toggleFormDialog, setResponseError)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;

        if (failureResponseMessage) expect(setResponseError).toBeCalledWith(failureResponseMessage);
        else expect(setResponseError).not.toBeCalled();

        expect(actions.length).toBe(expectedNumOfActions);
        expect(actualAction).toEqual(expectedAction);
        expect(toggleFormDialog).not.toBeCalled();
      });
    });
  });

  describe('fetchLogout', () => {
    const successResponseBody = { status: 200 };

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchLogout()).then(() => {
        expect(axios.post).toBeCalledWith(LOGOUT_URL);
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      dispatch(fetchLogout()).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const expectedAction: SetUserAction = {
          type: SET_USER,
          payload: null,
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
      });
    });
    it('should handle api call failure', () => {
      const { dispatch, getActions } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.reject());

      dispatch(fetchLogout()).then(() => {
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

  describe('fetchCurrentUser', () => {
    it('should call api with proper arguments', () => {
      const dispatch = jest.fn();

      mocked(axios.get).mockImplementationOnce(() => Promise.resolve({ status: 200, data: {} }));

      return fetchCurrentUser(dispatch).then(() => {
        const url = `${USERS_URL}/current`;
        expect(axios.get).toBeCalledWith(url);
      });
    });

    it('should handle api call success', () => {
      const dispatch = jest.fn();
      mocked(axios.get).mockImplementationOnce(() => Promise.resolve({ status: 200, data: {} }));

      return fetchCurrentUser(dispatch).then(() => {
        const actions = dispatch.mock.calls.map(([action]) => action);
        const actualActionTypes = actions.map(({ type }) => type);
        const expectedActionTypes = [
          SET_USER,
          SET_PROJECTS,
          SET_ISSUES,
          SET_ISSUES_CONTAINERS,
          SET_TEAM_MEMBERS,
          SET_LOADING,
        ];

        const setLoadingPayload = actions[actions.length - 1].payload;

        expect(actualActionTypes).toEqual(expectedActionTypes);
        expect(setLoadingPayload).toBe(false);
      });
    });
    it('should handle api call failure', () => {
      const dispatch = jest.fn();
      mocked(axios.get).mockImplementationOnce(() => Promise.reject());

      return fetchCurrentUser(dispatch).then(() => {
        const actions = dispatch.mock.calls.map(([action]) => action);
        const [actualAction] = actions;
        const expectedAction = {
          type: SET_LOADING,
          payload: false,
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
      });
    });
  });

  describe('fetchChangePassword', () => {
    const password = 'password';
    const token = '123';

    const failureResponseBody = { response: { data: 'failure' } };

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      const history = useHistory();

      mocked(axios.put).mockImplementationOnce(() => Promise.resolve({ status: 200, data: {} }));

      return dispatch(fetchChangePassword(password, token, history)).then(() => {
        const url = `${USERS_URL}/reset-password`;
        expect(axios.put).toBeCalledWith(url, { password, token });
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore();
      const history = useHistory();
      mocked(axios.put).mockImplementationOnce(() => Promise.resolve({ status: 200, data: {} }));

      return dispatch(fetchChangePassword(password, token, history)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const expectedAction = {
          type: SET_NOTIFICATION,
          payload: passwordChangedSuccessfullyMessage,
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(history.push).toBeCalledWith('/signin');
      });
    });

    it('should handle api call failure', () => {
      const { dispatch, getActions } = mockStore();
      const history = useHistory();
      mocked(axios.put).mockImplementationOnce(() => Promise.reject(failureResponseBody));

      return dispatch(fetchChangePassword(password, token, history)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const expectedAction = {
          type: SET_NOTIFICATION,
          payload: {
            content: failureResponseBody.response.data,
            severity: NotificationSeverity.ERROR,
          },
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(history.push).not.toBeCalled();
      });
    });
  });

  describe('fetchRequestPasswordRecovery', () => {
    const requestBody = {
      email: 'email@email.com',
    };

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      const history = useHistory();

      mocked(axios.post).mockImplementationOnce(() => Promise.resolve({ status: 200, data: {} }));

      return dispatch(fetchRequestPasswordRecovery(requestBody, history)).then(() => {
        const url = `${USERS_URL}/reset-password`;
        expect(axios.post).toBeCalledWith(url, requestBody);
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore();
      const history = useHistory();
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve({ status: 200, data: {} }));

      return dispatch(fetchRequestPasswordRecovery(requestBody, history)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const expectedAction = {
          type: SET_NOTIFICATION,
          payload: checkEmailForPasswordRecoveryLinkMessage,
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(history.push).toBeCalledWith('/');
      });
    });

    it.each([
      [401, userWithGivenEmailDoesNotExistMessage],
      [500, defaultErrorNotificationMessage],
    ])('should handle api call failure', (status, message) => {
      const { dispatch, getActions } = mockStore();
      const history = useHistory();
      // eslint-disable-next-line prefer-promise-reject-errors
      mocked(axios.post).mockImplementationOnce(() => Promise.reject({ response: { status } }));

      return dispatch(fetchRequestPasswordRecovery(requestBody, history)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const expectedAction = {
          type: SET_NOTIFICATION,
          payload: message,
        };

        expect(actions.length).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(history.push).not.toBeCalled();
      });
    });
  });
});
