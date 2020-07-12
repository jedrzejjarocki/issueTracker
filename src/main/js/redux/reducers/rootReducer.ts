import {combineReducers} from 'redux';

import ui from './ui';
import user from './user';
import projects from './project';
import teamMembers from './teamMembers';
import issuesLists from './issuesLists';
import issues from './issues';

const rootReducer = combineReducers({
  ui,
  user,
  projects,
  teamMembers,
  issuesLists,
  issues,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
