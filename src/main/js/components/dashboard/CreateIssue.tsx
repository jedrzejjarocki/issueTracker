import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {makeStyles, MenuItem, TextField as BaseTextField} from '@material-ui/core';
import schema, {CreateIssueFormFields} from '../forms/validation/schemas/createIssue';
import teamMembersOptions from '../forms/selectOptions/TeamMembersOptions';
import issuesListsOptions from '../forms/selectOptions/IssuesListsOptions';
import issueTypeOptions from '../forms/selectOptions/issueTypeOptions';
import DialogForm from '../forms/DialogForm';
import {fetchCreateIssue, IssueRequestBody} from '../../redux/issues/actionCreators';
import {setCurrentProject} from '../../redux/ui/actionCreators';
import SelectField from '../forms/fields/SelectField';
import BasicTextField from '../forms/fields/BasicTextField';
import TextAreaField from '../forms/fields/TextAreaField';
import {RootState} from '../../redux/rootReducer';
import {IssueStatus, IssueType, UserRole} from '../../redux/utilTypes';
import {getCurrentProject, getLoading} from '../../redux/ui/selectors';
import {getUser} from '../../redux/user/selectors';
import {getIssuesContainersByProjectId} from '../../redux/issuesContainers/selectors';
import {getTeamMembersByProjectId} from '../../redux/teamMembers/selectors';
import {getProjectsAsArray} from '../../redux/projects/selectors';

const useStyles = makeStyles(() => ({
  halfWidth: {
    width: '50%',
  },
}));

interface Props extends ReduxProps, RouteComponentProps<any>{
}

const CreateIssue: React.FC<Props> = ({
  user,
  projects,
  currentProjectId,
  setCurrentProject, fetchCreateIssue,
  history,
  teamMembers,
  issuesLists,
}) => {
  const classes = useStyles();

  const initialValues: CreateIssueFormFields = {
    projectId: currentProjectId,
    type: IssueType.TASK,
    summary: '',
    description: '',
    status: IssueStatus.TO_DO,
    reporterId: user.id,
    assigneeId: 0,
    listId: issuesLists[0] ? issuesLists[0].id : 0,
    storyPointsEstimate: 0,
  };

  issuesLists.map((list) => console.log(list));

  const onSubmit = (values: CreateIssueFormFields) => {
    const request: IssueRequestBody = {
      type: values.type,
      summary: values.summary,
      description: values.description,
      status: values.status,
      assignee: values.assigneeId ? {
        id: values.assigneeId,
      } : null,
      list: {
        id: values.listId,
        '@type': issuesLists.find((list) => list.id === values.listId).type as 'Backlog' | 'Sprint',
      },
      storyPointsEstimate: values.storyPointsEstimate,
    };

    fetchCreateIssue(request);
    history.push(`/app/projects/${currentProjectId}/board`);
  };

  const handleProjectChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setCurrentProject(+e.target.value, UserRole.DEVELOPER);
  };

  return (
    <DialogForm
      enableReinitialize
      title="Create Issue"
      onSubmit={onSubmit}
      validationSchema={schema}
      submitButtonText="Create"
      toggleButtonText="Create"
      initialValues={initialValues}
      renderFields={(formikProps) => (
        <>
          <BaseTextField
            required
            select
            label="Project"
            variant="outlined"
            className={classes.halfWidth}
            value={currentProjectId}
            error={currentProjectId === null}
            helperText={currentProjectId === null ? 'Required' : ''}
            onChange={handleProjectChange}
            placeholder="Select project"
          >
            {projects.map(({ id, name }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </BaseTextField>

          {currentProjectId !== null && (
            <SelectField
              name="listId"
              label="Sprint"
              options={issuesListsOptions(issuesLists)}
              className={classes.halfWidth}
            />
          )}

          <SelectField
            formikProps={formikProps}
            name="type"
            label="Issue type"
            className={classes.halfWidth}
            options={issueTypeOptions}
          />
          <BasicTextField
            autoFocus
            required
            formikProps={formikProps}
            name="summary"
          />
          <TextAreaField name="description" />
          <SelectField
            name="assigneeId"
            label="Assignee"
            className={classes.halfWidth}
            options={teamMembersOptions(teamMembers, user.id)}
          />
          <BasicTextField
            name="storyPointsEstimate"
            label="Story points estimate"
            type="number"
            inputProps={{ min: '0', step: '1' }}
            className={classes.halfWidth}
            formikProps={formikProps}
          />
        </>
      )}
    />
  );
};

const mapStateToProps = (state: RootState) => {
  const currentProjectId = getCurrentProject(state);
  return {
    user: getUser(state),
    projects: getProjectsAsArray(state),
    issuesLists: getIssuesContainersByProjectId(state, String(currentProjectId)),
    teamMembers: getTeamMembersByProjectId(state, String(currentProjectId)),
    currentProjectId,
    loading: getLoading(state),
  };
};

const mapDispatchToProps = {
  setCurrentProject,
  fetchCreateIssue,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default withRouter(connector(CreateIssue));
