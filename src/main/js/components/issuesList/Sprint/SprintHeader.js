import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import clsx from 'clsx';
import {Grid, IconButton, makeStyles, Typography,} from '@material-ui/core';
import format from 'date-fns/format';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import * as propTypes from '../../../propTypes';
import StartSprint from './StartSprint';
import Dropdown from '../../dashboard/Dropdown';
import EditSprint from './EditSprint';
import DeleteSprint from './DeleteSprint';

const formatDate = (str) => format(Date.parse(str), 'dd/MMM/yyyy');

const SprintHeader = ({
  sprint, project, handleExpand, expanded, userRole,
}) => {
  const classes = (makeStyles((theme) => ({
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
    details: {
      transform: `translateX(${userRole === 'LEADER' ? theme.spacing(2) : 0}px)`,
    },
  })))();

  return (
    <Grid container component="header" justify="space-between" wrap="nowrap">
      <Grid item container direction="column" alignItems="flex-start" justify="flex-start">
        <Grid item>
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
        {sprint.goal && (
        <Grid item>
          <Typography variant="caption">{sprint.goal}</Typography>
        </Grid>
        )}
      </Grid>
      <Grid container item wrap="nowrap" justify="flex-end" alignItems="center" className={classes.details}>
        {sprint.startDate && (
        <Typography
          variant="caption"
        >
          {`${formatDate(sprint.startDate)} \u2022 ${formatDate(sprint.endDate)}`}
        </Typography>
        )}
        <StartSprint sprint={sprint} projectId={project.id} />
        {userRole === 'LEADER' && (
          <Dropdown render={
            (ref, ariaHaspopup, onClick) => (
              <IconButton
                ref={ref}
                aria-haspopup={ariaHaspopup}
                onClick={onClick}
              >
                <MoreVertOutlinedIcon fontSize="small" />
              </IconButton>
            )
          }
          >
            <EditSprint sprint={sprint} projectId={project.id} />
            <DeleteSprint sprint={sprint} projectId={project.id} backlogId={project.backlog} />
          </Dropdown>
        )}
      </Grid>
    </Grid>
  );
};

SprintHeader.propTypes = {
  sprint: propTypes.sprint.isRequired,
  project: propTypes.project.isRequired,
  handleExpand: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  userRole: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  userRole: state.ui.currentProjectUserRole,
});

export default connect(mapStateToProps)(SprintHeader);
