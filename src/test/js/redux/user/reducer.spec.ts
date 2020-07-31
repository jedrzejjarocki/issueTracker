import reducer from '../../../../main/js/redux/user/reducer';
import { User } from '../../../../main/js/entities/User';
import { setUser } from '../../../../main/js/redux/user/actionCreators';

const initialState: User = null;

describe('user reducer', () => {
  it('should set user', () => {
    const user = new User({ id: 1, username: 'username' });
    const action = setUser(user);
    const newState = reducer(initialState, action);

    expect(newState).toEqual(user);
  });
});
