import {RootState} from '../reducers/rootReducer';

export const getLoading = (state: RootState) => state.ui.loading;

export const getCurrentProjectId = (state: RootState) => state.ui.currentProject;

export const getCurrentProjectUserRole = (state: RootState) => state.ui.currentProjectUserRole;
