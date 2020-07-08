import React from 'react';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import BugReportOutlinedIcon from '@material-ui/icons/BugReportOutlined';
import {IssueType} from "../propTypes";

type IssueTypeProperties = {
  [type in IssueType]: {
    value: string;
    icon: JSX.Element;
  };
};

const issueTypeProperties: IssueTypeProperties = {
  [IssueType.TASK]: {
    value: "TASK",
    icon: <AssignmentTurnedInOutlinedIcon color="primary"/>
  },
  [IssueType.IMPROVEMENT]: {
    value: "IMPROVEMENT",
    icon: <TrendingUpIcon htmlColor="green"/>
  },
  [IssueType.NEW_FEATURE]: {
    value: "NEW FEATURE",
    icon: <AddBoxOutlinedIcon htmlColor="green"/>
  },
  [IssueType.BUG]: {
    value: 'BUG',
    icon: <BugReportOutlinedIcon color="error"/>
  }
}

export default issueTypeProperties;
