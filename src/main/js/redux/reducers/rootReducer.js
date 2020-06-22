import {combineReducers} from 'redux';

import projects from './project';
import ui from './ui';
import user from './user';

export default combineReducers({
  ui,
  user,
  projects,
});
