type id = number;

interface Entity {
  id: id
}

export enum UserRole {LEADER = "LEADER", DEVELOPER = "DEVELOPER"}
export enum IssueType {TASK, IMPROVEMENT, NEW_FEATURE, BUG}
export enum IssueStatus {TO_DO, IN_PROGRESS, DONE}

export interface User extends Entity {
  username: string,
}

export interface Issue extends Entity {
  summary: string,
  version: number,
  type: IssueType,
  status: IssueStatus,
  listId: id
  description: string | undefined
  assignee: id | undefined,
  storyPointsEstimate: number | null
}

export interface IssuesContainer extends Entity {
  issues: id[]
}

export interface Backlog extends IssuesContainer {
  type?: "Backlog"
}

export interface Sprint extends IssuesContainer {
  name: string,
  goal?: string,
  startDate?: string,
  endDate?: string
  type?: "Sprint"
}

export interface Project extends Entity {
  name: string,
  projectKey: string,
  team: id[],
  backlog: id,
  sprints: id[],
}

export interface TeamMember extends Entity {
  projectId: number
  userId: id,
  username: string,
  role: UserRole
}

export interface Message {
  content: string,
  severity: 'success' | 'info' | 'warning' | 'error'
}
