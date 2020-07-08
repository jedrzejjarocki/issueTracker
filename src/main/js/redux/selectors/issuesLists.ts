import {RootState} from "../reducers/rootReducer";
import {getProjectById} from "./project";
import {Backlog, Sprint} from "../../propTypes";

export const getSprintsByProjectId = (state: RootState, projectId: number) => {
  const project = getProjectById(state, projectId)

  if (project === undefined) return []

  return (project.sprints || [])
    .map(sprintId => (<Sprint> {
      ...state.issuesLists[sprintId],
      type: "Sprint"
    })).sort((s1, s2) => +(s1.startDate === null) - +(s2.startDate === null));
}

export const getIssuesListsByProjectId = (state: RootState, projectId: number) => {
  const project = getProjectById(state, projectId)

  if (project === undefined) return []

  const sprints = getSprintsByProjectId(state, projectId)
  const backlog = <Backlog> {
    ...state.issuesLists[project.backlog],
    type: "Backlog"
  }

  return [...sprints, backlog]
}