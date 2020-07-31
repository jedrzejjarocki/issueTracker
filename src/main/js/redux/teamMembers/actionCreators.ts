import axios from 'axios';
import { TEAM_MEMBERS_URL } from '../../api/commons';
import { setNotification } from '../ui/actionCreators';
import { RouterHistory, UserRole } from '../utilTypes';
import TeamMember from '../../entities/TeamMember';
import { RootThunk } from '../store';
import {
  ADD_MEMBER,
  AddTeamMemberAction,
  AddTeamMemberPayload,
  DELETE_MEMBER,
  DeleteTeamMemberAction,
  SET_TEAM_MEMBERS,
  SetTeamMembersAction,
  TeamMembersState,
  UPDATE_MEMBER,
  UpdateMemberAction,
} from './types';
import { defaultErrorNotificationMessage, NotificationMessage, NotificationSeverity } from '../ui/NotificationMessage';

export const setTeamMembers = (members: TeamMembersState): SetTeamMembersAction => ({
  type: SET_TEAM_MEMBERS,
  payload: members,
});

export const addMember = (payload: AddTeamMemberPayload): AddTeamMemberAction => ({
  type: ADD_MEMBER,
  payload,
});

export const updateMemberRole = (member: TeamMember): UpdateMemberAction => ({
  type: UPDATE_MEMBER,
  payload: member,
});

export const deleteMember = (projectId: number, memberId: number): DeleteTeamMemberAction => ({
  type: DELETE_MEMBER,
  payload: {
    projectId,
    memberId,
  },
});

export interface AddTeamMemberRequestBody {
  user: {
    id: number,
  },
  role: UserRole,
  project: {
    id: number,
  },
}

interface FetchAddTeamMember {
  (requestBody: AddTeamMemberRequestBody, username: string, history: RouterHistory): RootThunk
}

export const fetchAddTeamMember: FetchAddTeamMember = (
  requestBody,
  username,
  history,
) => async (dispatch) => {
  let message: NotificationMessage;

  try {
    const { data } = await axios.post(TEAM_MEMBERS_URL, requestBody);
    const addMemberPayload = { ...data, username };
    message = {
      content: 'Team member successfully added',
      severity: NotificationSeverity.SUCCESS,
    };

    dispatch(addMember(new TeamMember(addMemberPayload)));
    history.push('/app/people');
  } catch (err) {
    message = {
      content: 'Team member couldn\'t be added',
      severity: NotificationSeverity.ERROR,
    };
  } finally {
    dispatch(setNotification(message));
  }
};

export interface InviteUserRequestBody {
  project: {
    id: number,
  },
  email: string,
  role: UserRole,
}

interface FetchInviteUser {
  (requestBody: InviteUserRequestBody): RootThunk;
}

export const fetchInviteUser: FetchInviteUser = (requestBody) => async (dispatch) => {
  let message: NotificationMessage;
  try {
    await axios.post(`${TEAM_MEMBERS_URL}/invitations`, requestBody);
    message = {
      content: 'User has been invited',
      severity: NotificationSeverity.SUCCESS,
    };
  } catch (err) {
    message = defaultErrorNotificationMessage;
  } finally {
    dispatch(setNotification(message));
  }
};

export interface ChangeTeamMemberRoleRequestBody {
  id: number
  project: {
    id: number
  }
  user: {
    id: number
  }
  role: UserRole,
}

interface FetchChangeTeamMemberRole {
  (requestBody: ChangeTeamMemberRoleRequestBody, toggleDialog: () => void): RootThunk
}

export const fetchChangeTeamMemberRole: FetchChangeTeamMemberRole = (requestBody, toggleDialog) => (
  async (dispatch) => {
    try {
      const { data } = await axios.put(TEAM_MEMBERS_URL, requestBody);
      dispatch(updateMemberRole(new TeamMember(data)));
    } catch (err) {
      dispatch(setNotification({
        content: err.response.data.message,
        severity: NotificationSeverity.ERROR,
      }));
    } finally {
      toggleDialog();
    }
  }
);

interface FetchDeleteMember {
  (projectId: number, memberId: number, history: RouterHistory, toggleDialog: () => void): RootThunk
}

export const fetchDeleteMember: FetchDeleteMember = (
  projectId,
  memberId,
  history,
  toggleDialog,
) => (
  async (dispatch) => {
    try {
      const { status } = await axios.delete(`${TEAM_MEMBERS_URL}/${memberId}`);
      if (status !== 200) throw new Error();

      dispatch(deleteMember(projectId, memberId));
      history.push(`/app/projects/${projectId}/team`);
    } catch (err) {
      const message: NotificationMessage = {
        content: err?.response?.status === 409 ? err.response.data.message : 'Something went wrong',
        severity: NotificationSeverity.ERROR,
      };
      dispatch(setNotification(message));
    } finally {
      toggleDialog();
    }
  }
);
