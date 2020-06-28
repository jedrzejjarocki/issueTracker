import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {TextField} from 'material-ui-formik-components/TextField';
import {Select} from 'material-ui-formik-components/Select';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import {withRouter} from 'react-router-dom';
import {makeStyles, MenuItem, TextField as BaseTextField} from '@material-ui/core';
import * as propTypes from '../../propTypes';
import FormField from '../forms/FormField';
import creators from '../../redux/actions/creators';
import teamMembersOptions from '../forms/TeamMembersOptions';
import issuesListsOptions from '../forms/IssuesListsOptions';
import issueTypeOptions from '../forms/issueTypeOptions';
import DialogForm from '../forms/DialogForm';
import {BASE_URL} from '../../api/commons';
import {
  getCurrentProjectId,
  getIssuesListsByProjectId,
  getLoading,
  getSprintsByProjectId,
  getTeamMembers,
} from '../../redux/selectors';

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
      renderFields={({ errors, touched }) => (
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
          <FormField
            name="listId"
            label="Sprint"
            className={classes.halfWidth}
            component={Select}
            options={issuesListsOptions(issuesLists)}
          />
          )}

          <FormField
            required
            name="type"
            label="Issue type"
            component={Select}
            className={classes.halfWidth}
            options={issueTypeOptions}
          />
          <FormField
            autoFocus
            required
            name="summary"
            error={errors.summary}
            touched={touched.summary}
            component={TextField}
          />
          <FormField
            multiline
            rows={8}
            name="description"
            component={TextField}
          />
          <FormField
            name="assigneeId"
            label="Assignee"
            className={classes.halfWidth}
            component={Select}
            options={teamMembersOptions(teamMembers, user.id)}
          />
          <FormField
            name="storyPointsEstimate"
            label="Story points estimate"
            type="number"
            inputProps={{ min: '0', step: '1' }}
            component={TextField}
            className={classes.halfWidth}
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
  setCurrentProject: creators.setCurrentProject,
  addIssue: creators.addIssue,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateIssue),
);
