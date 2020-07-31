import { User } from '../../entities/User';
import { SET_USER, UserAction } from './types';

export default (state: User = null, action: UserAction) => {
  switch (action.type) {
    case SET_USER:
      return action.payload;

    default:
      return state;
  }
};
