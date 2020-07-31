import React from 'react';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import BugReportOutlinedIcon from '@material-ui/icons/BugReportOutlined';

type IssueTypeProperties = {
  [type: string]: {
    value: string;
    icon: JSX.Element;
  };
};

const issueTypeProperties: IssueTypeProperties = {
  TASK: {
    value: 'TASK',
    icon: <AssignmentTurnedInOutlinedIcon color="primary" />,
  },
  IMPROVEMENT: {
    value: 'IMPROVEMENT',
    icon: <TrendingUpIcon color="secondary" />,
  },
  NEW_FEATURE: {
    value: 'NEW FEATURE',
    icon: <AddBoxOutlinedIcon color="secondary" />,
  },
  BUG: {
    value: 'BUG',
    icon: <BugReportOutlinedIcon color="error" />,
  },
};

export default issueTypeProperties;
