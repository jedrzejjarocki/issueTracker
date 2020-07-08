import axios from 'axios';
import {TEAM_MEMBERS_URL} from '../../../api/commons';
import {setMessage} from '../ui/creators';

import {
  ADD_MEMBER,
  AddTeamMemberAction,
  AddTeamMemberPayload,
  DELETE_MEMBER,
  DeleteTeamMemberAction,
  SET_TEAM_MEMBERS,
  SetTeamMembersAction,
  UPDATE_MEMBER_ROLE,
  UpdateMemberRoleAction
} from "./types";
import {TeamMember, UserRole} from "../../../propTypes";
import {TeamMembersState} from "../../reducers/teamMembers";
import {Dispatch} from "redux";
import {RouterHistory} from "../../utilTypes";
import {RootThunk} from "../../store";

export const setTeamMembers = (members: TeamMembersState): SetTeamMembersAction => ({
  type: SET_TEAM_MEMBERS,
  payload: members,
});

export const addMember = (payload: AddTeamMemberPayload): AddTeamMemberAction => ({
  type: ADD_MEMBER,
  payload,
});

const updateMemberRole = (member: TeamMember): UpdateMemberRoleAction => ({
  type: UPDATE_MEMBER_ROLE,
  payload: member,
});

export const deleteMember = (projectId: number, memberId: number): DeleteTeamMemberAction => ({
  type: DELETE_MEMBER,
  payload: {
    projectId, memberId,
  },
});

interface AddTeamMemberRequestBody {
  user: {
    id: number,
  },
  role: UserRole,
  project: {
    id: number,
  },
}

export interface FetchAddTeamMemberFunc {
  (requestBody: AddTeamMemberRequestBody, username: string, history: RouterHistory): (dispatch: Dispatch) => Promise<void>
}

export const fetchAddTeamMember: FetchAddTeamMemberFunc = (requestBody, username, history) => async (dispatch) => {
  const { data } = await axios.post(TEAM_MEMBERS_URL, requestBody);
  const payload = { ...data, username };
  dispatch(addMember(payload));
  dispatch(setMessage({
    content: 'Team member successfully added',
    severity: 'success'
    })
  );
  history.push('/app/people');
};

interface InviteUserRequestBody {
  project: {
    id: number,
  },
  email: string,
  role: UserRole,
}

export interface FetchInviteUserFunc {
  (requestBody: InviteUserRequestBody): (dispatch: Dispatch) => Promise<void>
}

export const fetchInviteUser: FetchInviteUserFunc = (requestBody) => async (dispatch) => {
  try {
    await axios.post(`${TEAM_MEMBERS_URL}/invitations`, requestBody);
    dispatch(setMessage({
      content:'User has been invited',
      severity: 'success'
      })
    );
  } catch (err) {
    dispatch(setMessage({
      content: 'Something went wrong, try again',
      severity: 'error'
      })
    );
  }
};

interface ChangeTeamMemberRoleRequestBody {
  id: number
  project: {
    id: number
  }
  user: {
    id: number
  }
  role: UserRole,
}

export const fetchChangeTeamMemberRole = (requestBody: ChangeTeamMemberRoleRequestBody, toggleDialog: () => void): RootThunk => (
  async (dispatch) => {
    try {
      const { data } = await axios.put(TEAM_MEMBERS_URL, requestBody);
      dispatch(updateMemberRole(data));
    } catch (err) {
      dispatch(setMessage({
          content: err.response.data.message,
          severity: 'error'
        })
      );
    }
    toggleDialog();
  }
);

export const fetchDeleteMember = (projectId: number, memberId: number, history: RouterHistory, toggleDialog: () => void): RootThunk => (
  async (dispatch) => {
    try {
      const { status } = await axios.delete(`${TEAM_MEMBERS_URL}/${memberId}`);
      if (status === 200) {
        dispatch(deleteMember(projectId, memberId));
        history.push(`/app/projects/${projectId}/team`);
      }
    } catch (err) {
      if (err.response.status === 409) {
        dispatch(setMessage({
          content: err.response.data.message,
          severity:  'error'
          })
        );
      }
    }
    toggleDialog();
  }
);
