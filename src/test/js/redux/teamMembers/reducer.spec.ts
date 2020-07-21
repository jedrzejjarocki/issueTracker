import {Map} from 'immutable';
import reducer from '../../../../main/js/redux/teamMembers/reducer';
import {AddTeamMemberPayload, TeamMembersState} from '../../../../main/js/redux/teamMembers/types';
import TeamMember from '../../../../main/js/entities/TeamMember';
import {setLoading} from '../../../../main/js/redux/ui/actionCreators';
import {addMember, deleteMember, setTeamMembers} from '../../../../main/js/redux/teamMembers/actionCreators';
import {UserRole} from '../../../../main/js/redux/utilTypes';
import {addProject} from '../../../../main/js/redux/projects/actionCreators';
import {AddProjectPayload} from '../../../../main/js/redux/projects/types';

const initialState: TeamMembersState = Map();
const member1 = new TeamMember({ id: 1 });
const member2 = new TeamMember({ id: 2 });

const members: TeamMembersState = Map({
  [member1.id]: member1,
  [member2.id]: member2,
});

describe('team members reducer', () => {
  it('should return previous state if action type doesn\'t match', () => {
    const action = setLoading(false);
    const newState = reducer(initialState, action);

    expect(newState).toBe(initialState);
  });

  it('should return payload as new state', () => {
    const action = setTeamMembers(members);
    const newState = reducer(initialState, action);

    expect(newState).toBe(members);
  });

  it('should add new member', () => {
    const payload: AddTeamMemberPayload = {
      id: 3,
      projectId: 1,
      userId: 3,
      username: 'username',
      role: UserRole.DEVELOPER,
    };
    const action = addMember(payload);

    // before
    expect(initialState.get(`${payload.id}`)).toBeUndefined();

    const newState = reducer(initialState, action);

    // after
    const expectedTeamMember = new TeamMember(payload);
    expect(newState.get(`${payload.id}`)).toEqual(expectedTeamMember);
  });

  it('should delete team member', () => {
    const projectId = 1;
    const memberId = member1.id;
    // before
    expect(members.get(`${memberId}`)).toBe(member1);

    const action = deleteMember(projectId, memberId);
    const newState = reducer(members, action);

    // after
    expect(newState.get(`${memberId}`)).toBeUndefined();
  });

  it('should add project creator as new teamMember', () => {
    const payload = {
      team: [member1],
    } as AddProjectPayload;

    // before
    expect(initialState.get(`${member1.id}`)).toBeUndefined();

    const action = addProject(payload);
    const newState = reducer(initialState, action);

    // after
    expect(newState.get(`${member1.id}`)).toEqual(member1);
  });
});
