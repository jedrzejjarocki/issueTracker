import * as actionTypes from "./types";

const actionCreators = (types) => {
  const create = (type) => (payload) => ({
    type,
    payload,
  });

  const creators = {};

  Object.entries(types).reduce((prev, [key, value]) => {
    creators[key] = create(value);
  }, {});

  return creators;
};

export default actionCreators(actionTypes);
