import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import clsx from 'clsx';
import {
  Grid, IconButton, makeStyles, Typography,
} from '@material-ui/core';
import format from 'date-fns/format';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import StartSprint from './StartSprint';
import Dropdown from '../../dashboard/Dropdown';
import EditSprint from './EditSprint';
import DeleteSprint from './DeleteSprint';
import { RootState } from '../../../redux/rootReducer';
import Sprint from '../../../entities/Sprint';
import Project from '../../../entities/Project';
import { UserRole } from '../../../redux/utilTypes';
import { getCurrentProject } from '../../../redux/ui/selectors';
import StoryPointsSummary from '../StoryPointsSummary';
import Issue from '../../../entities/Issue';

const formatDate = (str: string) => format(Date.parse(str), 'dd/MMM/yyyy');

interface Props extends ReduxProps {
  sprint: Sprint
  project: Project
  issues: Issue[]
  handleExpand: () => void
  expanded: boolean
}

const SprintHeader: React.FC<Props> = ({
  sprint, project, issues, handleExpand, expanded, userRole,
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
      transform: `translateX(${userRole === UserRole.LEADER ? theme.spacing(2) : 0}px)`,
    },
  })))();

  return (
    <Grid container alignItems="flex-start" justify="space-between" wrap="nowrap" direction="row">
      <Grid item container direction="column" alignItems="flex-start" justify="flex-start" wrap="nowrap">
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
          {sprint.startDate && (
            <Typography
              variant="caption"
            >
              {`${formatDate(sprint.startDate)} \u2022 ${formatDate(sprint.endDate)}`}
            </Typography>
          )}
        </Grid>
        {sprint.goal && (
        <Grid item>
          <Typography variant="caption">{sprint.goal}</Typography>
        </Grid>
        )}
      </Grid>
      <Grid container item wrap="nowrap" justify="flex-end" alignItems="center" className={classes.details}>
        <StoryPointsSummary issues={issues} />
        <StartSprint sprint={sprint} projectId={project.id} />
        {userRole === UserRole.LEADER && (
          <Dropdown render={
            (ref, ariaHaspopup, toggleOpen) => (
              <IconButton
                ref={ref}
                aria-haspopup={ariaHaspopup}
                onClick={toggleOpen}
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

const mapStateToProps = (state: RootState) => ({
  userRole: getCurrentProject(state)?.userRole,
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(SprintHeader);
