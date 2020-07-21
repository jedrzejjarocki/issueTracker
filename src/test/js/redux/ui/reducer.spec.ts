import reducer, {initialState} from '../../../../main/js/redux/ui/reducer';
import {setProjects} from '../../../../main/js/redux/projects/actionCreators';
import {setCurrentProject, setLoading, setNotification} from '../../../../main/js/redux/ui/actionCreators';
import {defaultErrorNotificationMessage} from '../../../../main/js/redux/ui/NotificationMessage';
import {UserRole} from '../../../../main/js/redux/utilTypes';

describe('ui reducer', () => {
  it('should return initial state when action type doesn\'t match', () => {
    const action = setProjects(null);
    const newState = reducer(initialState, action);
    expect(newState).toBe(initialState);
  });

  it('should set loading', () => {
    const action = setLoading(false);

    // before
    expect(initialState.get('loading')).toBe(true);

    const newState = reducer(initialState, action);

    // after
    expect(newState.get('loading')).toBe(false);
  });

  it('should set notification', () => {
    const action = setNotification(defaultErrorNotificationMessage);

    // before
    expect(initialState.get('notification')).toBeNull();

    const newState = reducer(initialState, action);

    // after
    expect(newState.get('notification')).toBe(defaultErrorNotificationMessage);
  });

  it('should set current project', () => {
    const id = 1;
    const userRole = UserRole.DEVELOPER;
    const action = setCurrentProject(id, userRole);

    // before
    expect(initialState.get('currentProject')).toBeNull();

    const newState = reducer(initialState, action);

    expect(newState.get('currentProject')).toEqual({ id, userRole });
  });
});
