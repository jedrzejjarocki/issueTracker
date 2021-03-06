import * as yup from 'yup';
import {
  assigneeId,
  containerId,
  description,
  issueSummary as summary,
  issueType as type,
  storyPointsEstimate,
} from '../validators';
import { IssueStatus, IssueType } from '../../../../redux/utilTypes';

export interface UpdateIssueFormFields {
  id: number
  version: number
  priority: number
  type: IssueType
  status: IssueStatus
  summary: string
  description: string
  assigneeId: number
  containerId: number
  storyPointsEstimate: number
}

export default yup.object().shape({
  type,
  summary,
  description,
  assigneeId,
  containerId,
  storyPointsEstimate,
});
