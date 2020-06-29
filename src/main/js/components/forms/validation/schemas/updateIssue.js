import * as yup from 'yup';
import {
  assigneeId,
  description,
  issueSummary as summary,
  issueType as type,
  listId,
  storyPointsEstimate,
} from '../validators';

export default yup.object().shape({
  type,
  summary,
  description,
  assigneeId,
  listId,
  storyPointsEstimate,
});
