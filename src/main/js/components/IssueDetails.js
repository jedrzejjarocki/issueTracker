import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Card, Grid, makeStyles, Typography,} from '@material-ui/core';
import {Select} from 'material-ui-formik-components/Select';
import {TextField} from 'material-ui-formik-components/TextField';
import {Form, Formik} from 'formik';
import CloseIcon from '@material-ui/icons/Close';
import * as yup from 'yup';
import axios from 'axios';
import creators from '../redux/actions/creators';
import * as propTypes from '../propTypes';
import FormField from './forms/FormField';
import teamMembersOptions from './forms/TeamMembersOptions';
import RouterLink from './commons/RouterLink';
import issueTypeOptions from './forms/issueTypeOptions';
import SubmitButton from './forms/SubmitButton';
import {BASE_URL} from '../api/commons';
import issueStatusOptions from './forms/issueStatusOptions';
import {getTeamMembers} from '../redux/selectors';

const useStyles = makeStyles((theme) => ({
  flexContainer: {
    '& > *': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      margin: theme.spacing(3),
    },
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing(3),
  },
  halfWidth: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
}));

const schema = yup.object().shape({
  type: yup.string().required('Required'),
  summary: yup.string().required('Must not be empty'),
  description: yup.string(),
  assigneeId: yup.number(),
  listId: yup.number(),
  storyPointsEstimate: yup
    .number()
    .moreThan(-1, 'Must not be negative integer'),
});

const IssueDetails = ({
  project, issue, userId, updateIssue, setMessage, history, teamMembers,
}) => {
  const classes = useStyles();

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

      const sprintIdQuery = `?listId=${values.listId}`;
      let url = `${BASE_URL}/projects/${project.id}/issues/${values.id}`;

      if (values.listId !== 0) url += sprintIdQuery;

      const { data } = await axios.put(url, requestBody);
      const issueData = { ...data };
      issueData.assignee = data.assignee ? data.assignee.id : null;
      console.log(issueData);
      updateIssue(issueData);

      // force rerender
      history.push(`/projects/${project.id}/issues/${values.id}`);
    } catch (err) {
      console.log(err);
      setMessage({
        content: err.response.data.message,
        severity: 'error',
      });
    }
  };

  return (
    <>
      {project && issue && (
        <Grid item xs={4} lg={5}>
          <Card variant="outlined" className={classes.flexContainer}>
            <div className={classes.flexRow}>
              <Typography variant="button">{`${project.projectKey}-${issue.id}`}</Typography>
              <RouterLink to={`/projects/${project.id}`}>
                <CloseIcon />
              </RouterLink>
            </div>
            <Formik
              enableReinitialize
              onSubmit={onSubmit}
              initialValues={{
                id: issue.id,
                version: issue.version,
                type: issue.type,
                summary: issue.summary,
                status: issue.status,
                listId: issue.listId,
                description: issue.description,
                assigneeId: issue.assignee || 0,
                storyPointsEstimate: issue.storyPointsEstimate,
              }}
              validationSchema={schema}
            >
              {({ errors, touched, dirty }) => (
                <Form>
                  <FormField
                    required
                    name="type"
                    label="Issue type"
                    component={Select}
                    className={classes.halfWidth}
                    options={issueTypeOptions}
                  />
                  <FormField
                    required
                    name="status"
                    component={Select}
                    error={errors.status}
                    touched={touched.status}
                    options={issueStatusOptions}
                    className={classes.halfWidth}
                  />
                  <FormField
                    required
                    name="summary"
                    component={TextField}
                    error={errors.summary}
                    touched={touched.summary}
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
                    options={teamMembersOptions(teamMembers, userId)}
                  />
                  <FormField
                    name="storyPointsEstimate"
                    label="Story points estimate"
                    type="number"
                    inputProps={{ min: '0', step: '1' }}
                    component={TextField}
                    className={classes.halfWidth}
                  />
                  {dirty && <SubmitButton />}
                </Form>
              )}
            </Formik>
          </Card>
        </Grid>
      )}
    </>
  );
};

IssueDetails.propTypes = {
  project: propTypes.project.isRequired,
  issue: propTypes.issue.isRequired,
  userId: PropTypes.number.isRequired,
  updateIssue: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  teamMembers: PropTypes.arrayOf(propTypes.teamMember).isRequired,
};

const mapStateToProps = (state, { match }) => {
  const { issueId, projectId } = match.params;
  return {
    issue: state.issues[issueId],
    userId: state.user.id,
    teamMembers: getTeamMembers(projectId, state),
  };
};

const mapDispatchToProps = {
  updateIssue: creators.updateIssue,
  setMessage: creators.setMessage,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(IssueDetails),
);
