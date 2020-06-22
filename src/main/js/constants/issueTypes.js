import React from 'react';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import BugReportOutlinedIcon from '@material-ui/icons/BugReportOutlined';

const issueTypes = {
  TASK: <AssignmentTurnedInOutlinedIcon color="primary" />,
  IMPROVEMENT: <TrendingUpIcon htmlColor="green" />,
  NEW_FEATURE: <AddBoxOutlinedIcon htmlColor="green" />,
  BUG: <BugReportOutlinedIcon color="error" />,
};

export default issueTypes;
