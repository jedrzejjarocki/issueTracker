import {applyMiddleware, createStore} from 'redux';
import {createLogger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
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
  applyMiddleware(thunkMiddleware, createLogger()),
);

// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true })
