import * as yup from 'yup';

import {
  assigneeId,
  description,
  issueSummary as summary,
  issueType as type,
  listId,
  projectId,
  storyPointsEstimate,
} from '../validators';
import {IssueStatus, IssueType} from '../../../../propTypes';

export interface CreateIssueFormFields {
  projectId: number
  type: IssueType
  summary: string
  description: string
  status: IssueStatus
  reporterId: number
  assigneeId: number
  listId: number
  storyPointsEstimate: number
}

export default yup.object().shape({
  projectId,
  type,
  summary,
  description,
  assigneeId,
  listId,
  storyPointsEstimate,
});
