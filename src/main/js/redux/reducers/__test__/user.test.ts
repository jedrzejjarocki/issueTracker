import reducer from '../user';
import {User} from '../../../propTypes';
import {setLoading} from '../../actions/ui/creators';
import {setUser} from '../../actions/user/creators';

const initialState: null = null;

const user: User = {
  id: 1,
  username: 'name',
};

describe('user reducer', () => {
  it('should return state if action type doesn\'t match', () => {
    const action = setLoading(false);
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual(initialState);
  });

  it('should set state', () => {
    const action = setUser(user);
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual(action.payload);
  });
});
