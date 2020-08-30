import { Record } from 'immutable';
import { IssueStatus, IssueType } from '../redux/utilTypes';
import BaseEntity from './BaseEntity';

export interface IssueProps extends BaseEntity {
  summary: string
  version: number
  priority: number
  type: IssueType
  status: IssueStatus
  containerId: number
  description: string
  assignee: number | null
  storyPointsEstimate: number
  createdBy: string
  createdTime: string
  lastModifiedBy: string
  lastModifiedTime: string
}

const defaultIssueProps: IssueProps = {
  id: 0,
  summary: '',
  version: 0,
  priority: 0,
  type: IssueType.NEW_FEATURE,
  status: IssueStatus.TO_DO,
  containerId: 0,
  description: '',
  assignee: 0,
  storyPointsEstimate: 0,
  createdBy: '',
  createdTime: '',
  lastModifiedBy: '',
  lastModifiedTime: '',
};

export default class Issue extends Record(defaultIssueProps) {}
