import * as yup from 'yup';

import {
  assigneeId,
  containerId,
  description,
  issueSummary as summary,
  issueType as type,
  projectId,
  storyPointsEstimate,
} from '../validators';
import { IssueStatus, IssueType } from '../../../../redux/utilTypes';

export interface CreateIssueFormFields {
  projectId: number
  type: IssueType
  summary: string
  description: string
  status: IssueStatus
  reporterId: number
  assigneeId: number
  containerId: number
  storyPointsEstimate: number
}

export default yup.object().shape({
  projectId,
  type,
  summary,
  description,
  assigneeId,
  containerId,
  storyPointsEstimate,
});
