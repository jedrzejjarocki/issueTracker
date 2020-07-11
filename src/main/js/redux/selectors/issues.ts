import {RootState} from "../reducers/rootReducer";

export const getIssuesByListId = (state: RootState, listId: number) =>
  Object.values(state.issues).filter(issue => issue.listId === listId)

export const getIssueById = (state: RootState, issueId: number | string) => state.issues[issueId]