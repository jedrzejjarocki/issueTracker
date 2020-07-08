import {RootState} from "../reducers/rootReducer";

export const getLoading = (state: RootState) => state.ui.loading;

export const getCurrentProjectId = (state: RootState) => state.ui.currentProject;