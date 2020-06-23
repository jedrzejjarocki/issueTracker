import {addIssue, setIssues, updateIssue} from '../actions/types';

const setIssue = (state, issue) => {
  const stateCopy = { ...state };
  stateCopy[issue.id] = issue;
  return stateCopy;
};

export default (state = null, { type, payload }) => {
  switch (type) {
    case setIssues:
      return payload || {};

    case addIssue:
      return setIssue(state, payload);

    case updateIssue:
      console.log(payload);
      return setIssue(state, payload);

    default:
      return state;
  }
};
