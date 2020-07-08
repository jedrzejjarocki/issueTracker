import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import clsx from 'clsx';
import {Grid, IconButton, makeStyles, Typography,} from '@material-ui/core';
import format from 'date-fns/format';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import StartSprint from './StartSprint';
import Dropdown from '../../dashboard/Dropdown';
import EditSprint from './EditSprint';
import DeleteSprint from './DeleteSprint';
import {RootState} from "../../../redux/reducers/rootReducer";
import {Project, Sprint, UserRole} from "../../../propTypes";

const formatDate = (str: string) => format(Date.parse(str), 'dd/MMM/yyyy');

interface Props extends ReduxProps {
  sprint: Sprint
  project: Project
  handleExpand: () => void
  expanded: boolean
}

const SprintHeader: React.FC<Props> = ({
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
      transform: `translateX(${userRole === UserRole.LEADER ? theme.spacing(2) : 0}px)`,
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
        {userRole === UserRole.LEADER && (
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

const mapStateToProps = (state: RootState) => ({
  userRole: state.ui.currentProjectUserRole,
});

const connector = connect(mapStateToProps)
type ReduxProps = ConnectedProps<typeof connector>

export default connector(SprintHeader);
