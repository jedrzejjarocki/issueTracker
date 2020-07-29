import { Record } from 'immutable';
import { IssueStatus, IssueType } from '../redux/utilTypes';
import BaseEntity from './BaseEntity';

export interface IssueProps extends BaseEntity {
  summary: string
  version: number
  priority: number
  type: IssueType
  status: IssueStatus,
  containerId: number,
  description: string | undefined
  assignee: number | undefined,
  storyPointsEstimate: number | null
  createdBy: string
  createdTime: string
  lastModifiedBy: string,
  lastModifiedTime: string
}

const defaultIssueProps: IssueProps = {
  id: 0,
  summary: '',
  version: 0,
  priority: null,
  type: null,
  status: null,
  containerId: 0,
  description: '',
  assignee: 0,
  storyPointsEstimate: 0,
  createdBy: null,
  createdTime: null,
  lastModifiedBy: null,
  lastModifiedTime: null,
};

export default class Issue extends Record(defaultIssueProps) {}
