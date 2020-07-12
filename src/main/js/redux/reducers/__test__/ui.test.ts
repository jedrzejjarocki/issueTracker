import reducer from '../ui';
import {Message, UserRole} from '../../../propTypes';
import {setCurrentProject, setMessage} from '../../actions/ui/creators';

const state = {
  message: null as Message,
  loading: true,
  currentProject: null as number,
  currentProjectUserRole: null as UserRole,
};

describe('UI reducer', () => {
  it("should return default state if action type doesn't match", () => {
    const newState = reducer(state, { type: 'ADD_ISSUE', payload: null });
    expect(newState).toEqual(state);
  });

  it('should set loading', () => {
    const { loading } = reducer(state, { type: 'SET_LOADING', payload: false });
    expect(loading).toBe(false);
  });

  it('should set message', () => {
    const msg: Message = { content: 'content', severity: 'error' };
    const action = setMessage(msg);
    const { message } = reducer(state, action);

    expect(message).toBe(msg);
  });

  it('should set current project details', () => {
    const action = setCurrentProject(1, UserRole.LEADER);
    const { currentProject, currentProjectUserRole } = reducer(state, action);

    expect(currentProject).toBe(1);
    expect(currentProjectUserRole).toBe(UserRole.LEADER);
  });
});
