/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';
import { Chip, Grid, withStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Issue from '../../entities/Issue';
import { IssueStatus } from '../../redux/utilTypes';
import statusProperties from '../../constants/issueStatuses';

interface Props {
  issues: Issue[],
}

const getSummary = (issues: Issue[]): Summary => {
  return Object.entries(issues.reduce((acc, issue) => {
    acc[issue.status] += issue.storyPointsEstimate;
    return acc;
  }, {
    [IssueStatus.TO_DO]: 0,
    [IssueStatus.IN_PROGRESS]: 0,
    [IssueStatus.DONE]: 0,
  })) as Summary;
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: 'min-content',
    margin: theme.spacing(0, 2),
    '& div': {
      marginLeft: theme.spacing(1) / 2,
    },
  },
}));

type Summary = [
  [IssueStatus.TO_DO, number],
  [IssueStatus.IN_PROGRESS, number],
  [IssueStatus.DONE, number]
];

const TinyChip = withStyles({
  sizeSmall: {
    height: '19px',
  },
  labelSmall: {
    paddingLeft: '6px',
    paddingRight: '6px',
  },
})(Chip);

const hasAnyPoints = (summary: Summary) => summary.some(([, points]) => points);

const StoryPointsSummary: React.FC<Props> = ({ issues }) => {
  const [summary, setSummary] = useState(getSummary(issues));
  const classes = useStyles();

  useEffect(() => {
    setSummary(getSummary(issues));
  }, [issues]);

  return (
    <>
      {
        hasAnyPoints(summary) && (
          <Grid container wrap="nowrap" className={classes.container}>
            {
              summary.map(([status, points]) => (
                <TinyChip
                  size="small"
                  label={points}
                  color={statusProperties[status].color}
                />
              ))
            }
          </Grid>
        )
      }
    </>
  );
};

export default StoryPointsSummary;
