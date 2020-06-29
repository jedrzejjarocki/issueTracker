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

export default yup.object().shape({
  projectId,
  type,
  summary,
  description,
  assigneeId,
  listId,
  storyPointsEstimate,
});
