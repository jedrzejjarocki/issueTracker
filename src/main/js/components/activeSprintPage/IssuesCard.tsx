import React from 'react';
import {
  Grid, List, Paper, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect, ConnectedProps } from 'react-redux';
import { Droppable } from 'react-beautiful-dnd';
import { IssueStatus } from '../../redux/utilTypes';
import Issue from '../../entities/Issue';
import issueStatusProperties from '../../constants/issueStatuses';
import { RootState } from '../../redux/rootReducer';
import { getTeamMembers } from '../../redux/teamMembers/selectors';
import { getUser } from '../../redux/user/selectors';
import IssueListItem from '../issuesList/IssueListItem';
import { getProjectById } from '../../redux/projects/selectors';
import TeamMember from '../../entities/TeamMember';

interface Props {
  status: IssueStatus
  issues: Issue[]
}

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '35vh',
    padding: theme.spacing(2),
  },
  itemDetails: {},
}));

const IssuesCard: React.FC<Props & ReduxProps> = ({
  status, issues, teamMembers, project,
}) => {
  const getMember = (memberId: number) => teamMembers.get(`${memberId}`) as TeamMember;
  const classes = useStyles();
  return (
    <Paper variant="outlined" className={classes.root}>
      <Grid container justify="space-between">
        <Typography variant="body2">
          {issueStatusProperties[status].text}
        </Typography>
        <Typography variant="caption">
          {issues.length}
        </Typography>
      </Grid>
      {/* @Todo */}
      <Droppable droppableId="aaaaa">
        {
          () => (
            <List dense>
              {issues.map((issue, index) => (
                <IssueListItem
                  draggableId={`active_sprint-${issue.id}`}
                  key={issue.id}
                  issue={issue}
                  getMember={getMember}
                  index={index}
                  project={project}
                />
              ))}
            </List>
          )
        }
      </Droppable>
    </Paper>
  );
};

const mapStateToProps = (state: RootState) => ({
  teamMembers: getTeamMembers(state),
  currentUserId: getUser(state)!.id,
  project: getProjectById(state, `${state.ui.get('currentProject')!.id}`),
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(IssuesCard);
