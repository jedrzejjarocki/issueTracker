import {setUser} from '../actions/types';

export default (state = null, { type, payload }) => {
  switch (type) {
    case setUser:
      return payload;

    default:
      return state;
  }
};
