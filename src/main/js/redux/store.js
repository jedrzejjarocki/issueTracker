import {createStore} from 'redux';
import rootReducer from './reducers/rootReducer';

const initialState = {
  ui: {
    message: null,
    loading: true,
    currentProject: null,
  },
  user: null,
  projects: [],
};

export default createStore(
  rootReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true }),
);
