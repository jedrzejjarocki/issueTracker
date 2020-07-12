import reducer from '../teamMembers';
import {setLoading} from '../../actions/ui/creators';
import {deleteMember, setTeamMembers, updateMemberRole} from '../../actions/teamMember/creators';
import {UserRole} from '../../../propTypes';
import {addProject} from '../../actions/project/creators';
import {AddProjectPayload} from '../../actions/project/types';

const initialState = {};

const members = {
  1: {
    projectId: 1,
    userId: 1,
    username: 'name',
    role: UserRole.DEVELOPER,
    id: 1,
  },
};

describe('team members reducer', () => {
  it('should return state if action type doesn\'t match', () => {
    const action = setLoading(false);
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual(initialState);
  });

  it('should set state', () => {
    const action = setTeamMembers(members);
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual(action.payload);
  });

  it('should add project creator', () => {
    const payload: AddProjectPayload = {
      name: 'name',
      id: 1,
      projectKey: 'key',
      team: [{
        projectId: 2,
        userId: 2,
        username: 'name',
        role: UserRole.DEVELOPER,
        id: 2,
      }],
      backlog: {
        id: 0,
        issues: [],
      },
    };
    const action = addProject(payload);
    const newState = reducer(initialState, action);

    expect(newState[action.payload.team[0].id]).toStrictEqual(action.payload.team[0]);
  });

  it('should update member', () => {
    const updatedMember = {
      projectId: 1,
      userId: 1,
      username: 'new name',
      role: UserRole.LEADER,
      id: 1,
    };
    const action = updateMemberRole(updatedMember);
    const newState = reducer(members, action);

    expect(newState[action.payload.id]).toStrictEqual(action.payload);
  });

  it('should delete member', () => {
    const memberId = 1;
    const action = deleteMember(1, memberId);
    const newState = reducer(members, action);

    expect(newState[memberId]).toBeUndefined();
  });
});
