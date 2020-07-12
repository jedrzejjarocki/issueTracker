import {Action, applyMiddleware, createStore} from 'redux';
import thunkMiddleware, {ThunkAction} from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer, {RootState} from './reducers/rootReducer';
import {IssueAction} from './actions/issue/types';
import {IssuesListsAction} from './actions/issuesList/types';
import {ProjectAction} from './actions/project/types';
import {TeamMemberAction} from './actions/teamMember/types';
import {UIAction} from './actions/ui/types';
import {UserAction} from './actions/user/types';

export default createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

export type RootThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export type RootAction = IssueAction | IssuesListsAction | ProjectAction | TeamMemberAction | UIAction | UserAction;
