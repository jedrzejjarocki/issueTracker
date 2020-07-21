import * as yup from 'yup';
import {
  assigneeId,
  description,
  issueSummary as summary,
  issueType as type,
  listId,
  storyPointsEstimate,
} from '../validators';
import {IssueStatus, IssueType} from '../../../../redux/utilTypes';

export interface UpdateIssueFormFields {
  id: number
  version: number
  type: IssueType
  status: IssueStatus
  summary: string
  description: string
  assigneeId: number
  listId: number
  storyPointsEstimate: number
}

export default yup.object().shape({
  type,
  summary,
  description,
  assigneeId,
  listId,
  storyPointsEstimate,
});
