import { Action, applyMiddleware, createStore } from 'redux';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { RootState } from './rootReducer';

export default createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

export type RootThunk<ReturnType = Promise<any>> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
