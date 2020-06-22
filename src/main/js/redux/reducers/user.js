import * as actionType from '../actions/types';

const initialState = null;

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.setUser:
      return payload;

    default:
      return state;
  }
};
