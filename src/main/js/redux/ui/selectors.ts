import {RootState} from '../rootReducer';

export const getLoading = (state: RootState) => state.ui.get('loading');

export const getMessage = (state: RootState) => state.ui.get('notification');

export const getCurrentProject = (state: RootState) => state.ui.get('currentProject');
