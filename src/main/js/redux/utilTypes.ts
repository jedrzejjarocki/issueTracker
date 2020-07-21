export interface RouterHistory {
  push: (url: string) => void
}

export enum UserRole {LEADER = 'LEADER', DEVELOPER = 'DEVELOPER'}

export enum IssueType {TASK= 'TASK', IMPROVEMENT = 'IMPROVEMENT', NEW_FEATURE = 'NEW_FEATURE', BUG = 'BUG'}

export enum IssueStatus {TO_DO, IN_PROGRESS, DONE}
