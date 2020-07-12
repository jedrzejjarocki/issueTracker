import {ProjectsState} from '../../reducers/project';
import {UserRole} from '../../../propTypes';

export const SET_PROJECTS = 'SET_PROJECTS';
export const ADD_PROJECT = 'ADD_PROJECT';

export interface SetProjectsAction {
  type: typeof SET_PROJECTS
  payload: ProjectsState
}

export interface AddProjectPayload {
  name: string
  id: number
  projectKey: string
  team: {
    id: number
    userId: number
    projectId: number
    username: string
    role: UserRole
  }[]
  backlog: {
    id: number
    issues: []
  }
}

export interface AddProjectAction {
  type: typeof ADD_PROJECT
  payload: AddProjectPayload
}

export type ProjectAction = SetProjectsAction | AddProjectAction;
