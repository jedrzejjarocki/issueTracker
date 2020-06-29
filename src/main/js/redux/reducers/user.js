import {SET_USER} from '../actions/user';

export default (state = null, { type, payload }) => {
  switch (type) {
    case SET_USER:
      return payload;

    default:
      return state;
  }
};
