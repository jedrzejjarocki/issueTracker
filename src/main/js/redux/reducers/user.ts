import {SET_USER} from '../actions/user/types';
import {User} from '../../propTypes';
import {RootAction} from '../store';

export default (state: User | null = null, action: RootAction) => {
  switch (action.type) {
    case SET_USER:
      return action.payload;

    default:
      return state;
  }
};
