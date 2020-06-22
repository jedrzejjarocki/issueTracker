import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {TextField} from 'material-ui-formik-components/TextField';
import {Select} from 'material-ui-formik-components/Select';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import {withRouter} from 'react-router-dom';
import {makeStyles, MenuItem, TextField as BaseTextField} from '@material-ui/core';
import * as propTypes from '../propTypes';
import FormField from './forms/FormField';
import creators from '../redux/actions/creators';
import teamMembersOptions from './forms/TeamMembersOptions';
import sprintOptions from './forms/SprintsOptions';
import issueTypeOptions from './forms/issueTypeOptions';
import DialogForm from './forms/DialogForm';
import {BASE_URL} from '../api/commons';

const getCurrentProject = (projects, currentProjectId) => (projects || []).find(({ id }) => id === +currentProjectId);

const useStyles = makeStyles((theme) => ({
  flexContainer: {
    '& > *': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginBottom: theme.spacing(3),
    },
  },
  halfWidth: {
    width: '50%',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
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
    listId: 0,
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

      const sprintIdQuery = `?sprintId=${values.listId}`;
      let url = `${BASE_URL}/projects/${currentProjectId}/issues`;

      if (values.listId !== 0) url += sprintIdQuery;

      const { data } = await axios.post(url, requestBody);
      addIssue({
        projectId: currentProjectId,
        issue: data,
      });

      history.push(`/projects/${currentProjectId}`);
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
            {projects.map(({ id, name }) => (
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
            options={sprintOptions(
              getCurrentProject(projects, currentProjectId),
            )}
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
            options={teamMembersOptions(
              getCurrentProject(projects, currentProjectId),
              user,
            )}
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
};

CreateIssue.propTypes = {
  user: propTypes.user.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentProjectId: PropTypes.number,
  setCurrentProject: PropTypes.func.isRequired,
  projects: PropTypes.arrayOf(propTypes.project).isRequired,
  addIssue: PropTypes.func.isRequired,
};

const mapStateToProps = ({
  user,
  projects,
  ui: { currentProject, loading },
}) => ({
  user,
  projects,
  currentProjectId: currentProject,
  loading,
});

const mapDispatchToProps = {
  setCurrentProject: creators.setCurrentProject,
  addIssue: creators.addIssue,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateIssue),
);
