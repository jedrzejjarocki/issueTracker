import {combineReducers} from 'redux';
import ui, {UIAction} from './ui/reducer';
import user, {UserAction} from './user/reducer';
import projects from './projects/reducer';
import teamMembers from './teamMembers/reducer';
import issuesContainers from './issuesContainers/reducer';
import issues from './issues/reducer';
import {IssuesContainersAction} from './issuesContainers/types';
import {IssuesAction} from './issues/types';
import {ProjectsAction} from './projects/types';
import {TeamMembersAction} from './teamMembers/types';

const rootReducer = combineReducers({
  ui,
  user,
  projects,
  teamMembers,
  issuesContainers,
  issues,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
export type RootAction = IssuesAction
| IssuesContainersAction
| ProjectsAction
| TeamMembersAction
| UIAction
| UserAction;
