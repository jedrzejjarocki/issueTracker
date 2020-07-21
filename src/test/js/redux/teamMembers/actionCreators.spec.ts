import axios from 'axios';
import {mocked} from 'ts-jest/utils';
import reactRouterDom from 'react-router-dom';
import thunk, {ThunkDispatch} from 'redux-thunk';
import configureStore from 'redux-mock-store';
import {Action} from 'redux';
import {
  AddTeamMemberRequestBody,
  ChangeTeamMemberRoleRequestBody,
  fetchAddTeamMember,
  fetchChangeTeamMemberRole,
  fetchDeleteMember,
  fetchInviteUser,
  InviteUserRequestBody,
} from '../../../../main/js/redux/teamMembers/actionCreators';
import {UserRole} from '../../../../main/js/redux/utilTypes';
import {
  ADD_MEMBER,
  AddTeamMemberAction,
  DELETE_MEMBER,
  DeleteTeamMemberAction,
  UPDATE_MEMBER,
  UpdateMemberAction,
} from '../../../../main/js/redux/teamMembers/types';
import {SET_NOTIFICATION, SetNotificationAction} from '../../../../main/js/redux/ui/reducer';
import {TEAM_MEMBERS_URL} from '../../../../main/js/api/commons';
import TeamMember from '../../../../main/js/entities/TeamMember';
import {defaultErrorNotificationMessage, NotificationSeverity} from '../../../../main/js/redux/ui/NotificationMessage';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

const toggleDialog = jest.fn();

const mockStore = configureStore<any, ThunkDispatch<any, any, Action<Promise<any>>>>([thunk]);

const { useHistory } = reactRouterDom;

afterEach(() => jest.clearAllMocks());

describe('team members action creators', () => {
  describe('fetchAddTeamMember', () => {
    const requestBody: AddTeamMemberRequestBody = {
      user: {
        id: 1,
      },
      role: UserRole.DEVELOPER,
      project: {
        id: 1,
      },
    };

    const successResponseBody = {
      data: {
        id: 100,
        projectId: requestBody.project.id,
        userId: requestBody.user.id,
        role: requestBody.role,
      },
    };

    const username = 'username';

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      const history = useHistory();

      mocked(axios.post).mockImplementationOnce(() => Promise.resolve({ data: {} }));

      return dispatch(fetchAddTeamMember(requestBody, username, history)).then(() => {
        const url = TEAM_MEMBERS_URL;
        expect(axios.post).toBeCalledWith(url, requestBody);
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      const history = useHistory();

      return dispatch(fetchAddTeamMember(requestBody, username, history)).then(() => {
        const actions = getActions();
        const [addMemberAction, setMessageAction] = actions;

        const expectedAddMemberAction: AddTeamMemberAction = {
          type: ADD_MEMBER,
          payload: { ...successResponseBody.data, username },
        };

        const expectedSetMessageAction: SetNotificationAction = {
          type: SET_NOTIFICATION,
          payload: {
            content: 'Team member successfully added',
            severity: NotificationSeverity.SUCCESS,
          },
        };

        expect(actions.length).toBe(2);
        expect(addMemberAction).toEqual(expectedAddMemberAction);
        expect(setMessageAction).toEqual(expectedSetMessageAction);
        expect(axios.post).toBeCalledWith(TEAM_MEMBERS_URL, requestBody);
        expect(history.push).toBeCalledWith('/app/people');
      });
    });

    it('should handle api call failure', () => {
      const { dispatch, getActions } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.reject());

      const history = useHistory();

      return dispatch(fetchAddTeamMember(requestBody, username, history)).then(() => {
        const actions = getActions();
        const [setMessageAction] = actions;

        const expectedSetMessageAction: SetNotificationAction = {
          type: SET_NOTIFICATION,
          payload: {
            content: 'Team member couldn\'t be added',
            severity: NotificationSeverity.ERROR,
          },
        };

        expect(history.push).not.toBeCalled();
        expect(actions.length).toBe(1);
        expect(setMessageAction).toEqual(expectedSetMessageAction);
        expect(axios.post).toBeCalledWith(TEAM_MEMBERS_URL, requestBody);
      });
    });
  });
  describe('fetchInviteUser', () => {
    const requestBody: InviteUserRequestBody = {
      project: {
        id: 1,
      },
      email: 'email@email.com',
      role: UserRole.DEVELOPER,
    };

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve());

      return dispatch(fetchInviteUser(requestBody)).then(() => {
        const url = `${TEAM_MEMBERS_URL}/invitations`;
        expect(axios.post).toBeCalledWith(url, requestBody);
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.resolve());

      return dispatch(fetchInviteUser(requestBody)).then(() => {
        const actions = getActions();

        const [actualAction] = actions;
        const numOfActions = actions.length;

        const expectedAction: SetNotificationAction = {
          type: SET_NOTIFICATION,
          payload: {
            content: 'User has been invited',
            severity: NotificationSeverity.SUCCESS,
          },
        };

        expect(actualAction).toEqual(expectedAction);
        expect(numOfActions).toBe(1);
      });
    });

    it('should handle api call failure', () => {
      const { dispatch, getActions } = mockStore();
      mocked(axios.post).mockImplementationOnce(() => Promise.reject());

      return dispatch(fetchInviteUser(requestBody)).then(() => {
        const actions = getActions();

        const [actualAction] = actions;
        const numOfActions = actions.length;

        const expectedAction: SetNotificationAction = {
          type: SET_NOTIFICATION,
          payload: defaultErrorNotificationMessage,
        };

        expect(actualAction).toEqual(expectedAction);
        expect(numOfActions).toBe(1);
      });
    });
  });

  describe('fetchChangeTeamMemberRole', () => {
    const requestBody: ChangeTeamMemberRoleRequestBody = {
      id: 1,
      project: {
        id: 1,
      },
      user: {
        id: 1,
      },
      role: UserRole.DEVELOPER,
    };

    const successResponseBody = {
      data: new TeamMember(),
    };

    const failureResponseBody = {
      response: {
        data: {
          message: 'failure message',
        },
      },
    };

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      mocked(axios.put).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchChangeTeamMemberRole(requestBody, toggleDialog)).then(() => {
        const url = TEAM_MEMBERS_URL;
        expect(axios.put).toBeCalledWith(url, requestBody);
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore();
      mocked(axios.put).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchChangeTeamMemberRole(requestBody, toggleDialog)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const numOfActions = actions.length;

        const expectedAction: UpdateMemberAction = {
          type: UPDATE_MEMBER,
          payload: successResponseBody.data,
        };

        expect(numOfActions).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(toggleDialog).toBeCalled();
      });
    });
    it('should handle api call failure', () => {
      const { dispatch, getActions } = mockStore();
      mocked(axios.put).mockImplementationOnce(() => Promise.reject(failureResponseBody));

      return dispatch(fetchChangeTeamMemberRole(requestBody, toggleDialog)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const numOfActions = actions.length;

        const expectedAction: SetNotificationAction = {
          type: SET_NOTIFICATION,
          payload: {
            content: failureResponseBody.response.data.message,
            severity: NotificationSeverity.ERROR,
          },
        };

        expect(numOfActions).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(toggleDialog).toBeCalled();
      });
    });
  });
  describe('fetchDeleteMember', () => {
    const successResponseBody = {
      status: 200,
    };

    const conflictResponseBody = {
      response: {
        status: 409,
        data: {
          message: 'failure message',
        },
      },
    };

    const unknownFailureResponseBody = {};

    const projectId = 1;
    const memberId = 1;

    it('should call api with proper arguments', () => {
      const { dispatch } = mockStore();
      const history = useHistory();
      mocked(axios.delete).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchDeleteMember(projectId, memberId, history, toggleDialog)).then(() => {
        const url = `${TEAM_MEMBERS_URL}/${memberId}`;
        expect(axios.delete).toBeCalledWith(url);
      });
    });

    it('should handle api call success', () => {
      const { dispatch, getActions } = mockStore();
      const history = useHistory();
      mocked(axios.delete).mockImplementationOnce(() => Promise.resolve(successResponseBody));

      return dispatch(fetchDeleteMember(projectId, memberId, history, toggleDialog)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const numOfActions = actions.length;

        const expectedAction: DeleteTeamMemberAction = {
          type: DELETE_MEMBER,
          payload: {
            memberId,
            projectId,
          },
        };
        const expectedHistoryPushUrl = `/app/projects/${projectId}/team`;

        expect(numOfActions).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(toggleDialog).toBeCalled();
        expect(history.push).toBeCalledWith(expectedHistoryPushUrl);
      });
    });

    it.each([
      [unknownFailureResponseBody, 'Something went wrong'],
      [conflictResponseBody, conflictResponseBody.response.data.message],
    ])('should handle api call failure', (responseBody, expectedMessageContent) => {
      const { dispatch, getActions } = mockStore();
      const history = useHistory();
      mocked(axios.delete).mockImplementationOnce(() => Promise.reject(responseBody));

      return dispatch(fetchDeleteMember(projectId, memberId, history, toggleDialog)).then(() => {
        const actions = getActions();
        const [actualAction] = actions;
        const numOfActions = actions.length;

        const expectedAction: SetNotificationAction = {
          type: SET_NOTIFICATION,
          payload: {
            content: expectedMessageContent,
            severity: NotificationSeverity.ERROR,
          },
        };

        expect(numOfActions).toBe(1);
        expect(actualAction).toEqual(expectedAction);
        expect(toggleDialog).toBeCalled();
        expect(history.push).not.toBeCalled();
      });
    });
  });
});
