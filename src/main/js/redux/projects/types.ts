import { Map } from 'immutable';
import TeamMember from '../../entities/TeamMember';
import { IssuesContainer } from '../../entities/IssuesContainer';
import Project from '../../entities/Project';

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
  team: TeamMember[]
  backlog: IssuesContainer
}

export interface AddProjectAction {
  type: typeof ADD_PROJECT
  payload: AddProjectPayload
}

export type ProjectsAction = SetProjectsAction | AddProjectAction;
export type ProjectsState = Map<string, Project>;
