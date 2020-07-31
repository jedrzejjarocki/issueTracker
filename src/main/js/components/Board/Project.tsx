/* eslint-disable arrow-body-style */
import React, { createContext, useState } from 'react';
import { connect, ConnectedProps, useDispatch } from 'react-redux';
import { DragDropContext, DraggableLocation, DragUpdate, DropResult, } from 'react-beautiful-dnd';
import { Redirect, Route, RouteComponentProps, Switch, withRouter, } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { List } from 'immutable';
import IssueDetails from '../Issue/IssueDetails';
import Sprint from '../issuesList/Sprint/Sprint';
import Backlog from '../issuesList/Backlog/Backlog';
import useSetCurrentProject from '../../hooks/useSetCurrentProject';
import Team from '../Team/Team';
import { RootState } from '../../redux/rootReducer';
import { getProjectById } from '../../redux/projects/selectors';
import { getBacklogByProjectId, getSprintsByProjectId } from '../../redux/issuesContainers/selectors';
import { getCurrentUserRoleByProjectId } from '../../redux/teamMembers/selectors';
import { reorderIssues } from '../../redux/issuesContainers/actionCreators';
import { fetchReorderIssues, IssueRequestBody } from '../../redux/issues/actionCreators';
import { getIssues } from '../../redux/issues/selectors';

export const DraggingOverContext = createContext(null);

const Project: React.FC<RouteComponentProps<any> & ReduxProps> = ({
  project,
  sprints,
  backlog,
  issues,
  match,
  userRole,
  fetchReorderIssues: fetchReorder,
}) => {
  useSetCurrentProject(userRole);
  const [draggingOver, setDraggingOver] = useState(null);

  const dispatch = useDispatch();

  const shouldNotBeReordered = (destination: DraggableLocation, source: DraggableLocation) => {
    return (
      !destination
      || (destination.droppableId === source.droppableId && destination.index === source.index)
    );
  };

  const getIssuesListOfContainer = (containerId: string): List<number> => {
    return [...sprints, backlog].find((container) => container.id === +containerId).issues;
  };

  const getPreviousOrderSnapshot = (sourceContainerId: string, destinationContainerId: string) => {
    const snapshot = {
      [sourceContainerId]: getIssuesListOfContainer(sourceContainerId),
    };

    if (sourceContainerId !== destinationContainerId) {
      snapshot[destinationContainerId] = getIssuesListOfContainer(destinationContainerId);
    }

    return snapshot;
  };

  const handleDragEnd = ({ draggableId, source, destination }: DropResult) => {
    setDraggingOver(null);
    if (shouldNotBeReordered(destination, source)) return;
    const sourceContainerId = source.droppableId;
    const destinationContainerId = destination.droppableId;

    const prevOrderSnapshot = getPreviousOrderSnapshot(sourceContainerId, destinationContainerId);

    reorderIssues(
      source.droppableId,
      destination.droppableId,
      destination.index,
      source.index,
      +draggableId,
      dispatch,
    );

    const issue = issues.get(draggableId).toJS();

    const requestBody: IssueRequestBody = {
      ...issue,
      assignee: issue.assignee ? {
        id: issue.assignee,
      } : null,
      container: {
        id: +destination.droppableId,
        '@type': +destination.droppableId === project.backlog ? 'Backlog' : 'Sprint',
      },
    };

    fetchReorder(requestBody, destination.index, prevOrderSnapshot);
  };

  const handleDraggingOver = ({ destination }: DragUpdate) => {
    return setDraggingOver(destination ? +destination.droppableId : null);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragUpdate={handleDraggingOver}>
      <DraggingOverContext.Provider value={draggingOver}>
        <Grid container>
          <Switch>
            <Route path={`${match.path}/board`}>
              <Grid container spacing={2}>
                <Grid item xs lg>
                  {sprints.map((sprint) => (
                    <Sprint key={sprint.id} project={project} sprint={sprint} />
                  ))}
                  <Backlog project={project} />
                </Grid>
                <Route path={`${match.path}/board/issues/:issueId`}>
                  <IssueDetails project={project} />
                </Route>
              </Grid>
            </Route>
            <Route path={`${match.path}/team`}>
              <Team />
            </Route>
            <Route>
              <Redirect to={`${match.url}/board`} />
            </Route>
          </Switch>
        </Grid>
      </DraggingOverContext.Provider>
    </DragDropContext>
  );
};

const mapStateToProps = (state: RootState, props: RouteComponentProps<{ projectId: string }>) => {
  return ({
    project: getProjectById(state, props.match.params.projectId),
    sprints: getSprintsByProjectId(state, props.match.params.projectId),
    backlog: getBacklogByProjectId(state, props.match.params.projectId),
    issues: getIssues(state),
    userRole: getCurrentUserRoleByProjectId(state, props.match.params.projectId),
  });
};

const connector = connect(mapStateToProps, { fetchReorderIssues });

type ReduxProps = ConnectedProps<typeof connector>;

export default withRouter(connector(Project));
