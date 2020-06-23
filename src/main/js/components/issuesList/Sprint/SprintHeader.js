import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Grid, makeStyles, Typography} from '@material-ui/core';
import format from 'date-fns/format';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as propTypes from '../../../propTypes';
import StartSprint from '../../StartSprint';

const useStyles = makeStyles((theme) => ({
  expand: {
    transform: 'rotate(-90deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(0deg)',
  },
}));

const formatDate = (str) => format(Date.parse(str), 'dd/MMM/yyyy');

const SprintHeader = ({
  sprint, project, handleExpand, expanded,
}) => {
  const classes = useStyles();
  return (
    <Grid component="header" container>
      <Grid item justify="flex-start">
        <Typography
          style={{ cursor: 'pointer' }}
          variant="subtitle2"
          onClick={handleExpand}
        >
          <ExpandMoreIcon
            fontSize="small"
            style={{ verticalAlign: 'top' }}
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
          />
          {sprint.name}
        </Typography>
      </Grid>
      { sprint.startDate && <Typography variant="caption">{`${formatDate(sprint.startDate)} \u2022 ${formatDate(sprint.endDate)}`}</Typography>}
      <StartSprint sprint={sprint} projectId={project.id} />
    </Grid>
  );
};

SprintHeader.propTypes = {
  sprint: propTypes.sprint.isRequired,
  project: propTypes.project.isRequired,
  handleExpand: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
};

export default SprintHeader;
