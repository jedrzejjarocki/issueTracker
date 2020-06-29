import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import {withRouter} from 'react-router-dom';
import {makeStyles, MenuItem, TextField as BaseTextField} from '@material-ui/core';
import * as propTypes from '../../propTypes';
import actions from '../../redux/actions/actions';
import teamMembersOptions from '../forms/selectOptions/TeamMembersOptions';
import issuesListsOptions from '../forms/selectOptions/IssuesListsOptions';
import issueTypeOptions from '../forms/selectOptions/issueTypeOptions';
import DialogForm from '../forms/DialogForm';
import {BASE_URL} from '../../api/commons';
import {
  getCurrentProjectId,
  getIssuesListsByProjectId,
  getLoading,
  getSprintsByProjectId,
  getTeamMembers,
} from '../../redux/selectors';
import SelectField from '../forms/fields/SelectField';
import BasicTextField from '../forms/fields/BasicTextField';
import TextAreaField from '../forms/fields/TextAreaField';

const useStyles = makeStyles(() => ({
  halfWidth: {
    width: '50%',
  },
}));

const schema = yup.object().shape({
  projectId: yup.number().required('Required'),
  type: yup.string().required('Required'),
  summary: yup.string().required('Must not be empty'),
  description: yup.string(),
  assigneeId: yup.number(),
  listId: yup.number(),
  storyPointsEstimate: yup
    .number()
    .moreThan(-1, 'Must not be negative integer'),
});

const CreateIssue = ({
  user,
  projects,
  currentProjectId,
  setCurrentProject,
  addIssue,
  history,
  teamMembers,
  issuesLists,
}) => {
  const classes = useStyles();

  const initialValues = {
    projectId: currentProjectId,
    type: 'TASK',
    summary: '',
    description: '',
    status: 'TO_DO',
    reporterId: user.id,
    assigneeId: 0,
    listId: issuesLists[0] ? issuesLists[0].id : 0,
    storyPointsEstimate: 0,
  };

  const handleProjectChange = (e) => {
    setCurrentProject(e.target.value);
  };

  const onSubmit = async (values) => {
    try {
      const requestBody = { ...values };
      delete requestBody.assigneeId;
      delete requestBody.listId;

      requestBody.assignee = values.assigneeId
        ? {
          id: values.assigneeId,
        }
        : null;

      requestBody.list = {
        id: values.listId,
        '@type': issuesLists.find((list) => list.id === values.listId).type,
      };

      const { data } = await axios.post(`${BASE_URL}/issues`, requestBody);
      const issueData = { ...data };
      issueData.assignee = data.assignee ? data.assignee.id : null;
      addIssue(issueData);

      history.push(`/app/projects/${currentProjectId}/board`);
    } catch (err) {
      console.log(err);
    }
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
            {Object.values(projects).map(({ id, name }) => (
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

CreateIssue.defaultProps = {
  currentProjectId: 0,
  teamMembers: [],
};

CreateIssue.propTypes = {
  user: propTypes.user.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentProjectId: PropTypes.number,
  setCurrentProject: PropTypes.func.isRequired,
  projects: PropTypes.objectOf(propTypes.project).isRequired,
  addIssue: PropTypes.func.isRequired,
  teamMembers: PropTypes.arrayOf(propTypes.teamMember),
  issuesLists: PropTypes.arrayOf(propTypes.sprint).isRequired,
};

const mapStateToProps = (state) => {
  const currentProjectId = +getCurrentProjectId(state);
  return {
    user: state.user,
    projects: state.projects,
    sprints: getSprintsByProjectId(currentProjectId, state),
    issuesLists: getIssuesListsByProjectId(currentProjectId, state),
    teamMembers: getTeamMembers(currentProjectId, state),
    currentProjectId,
    loading: getLoading(state),
  };
};

const mapDispatchToProps = {
  setCurrentProject: actions.setCurrentProject,
  addIssue: actions.addIssue,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateIssue),
);
