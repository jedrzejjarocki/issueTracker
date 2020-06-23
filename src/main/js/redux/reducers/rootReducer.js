import {combineReducers} from 'redux';

import ui from './ui';
import user from './user';
import projects from './project';
import teamMembers from './teamMembers';
import issuesLists from './issuesLists';
import issues from './issues';

export default combineReducers({
  ui,
  user,
  projects,
  teamMembers,
  issuesLists,
  issues,
});
