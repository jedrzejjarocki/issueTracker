import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Card, Grid, IconButton, makeStyles, Typography,} from '@material-ui/core';
import {Form, Formik} from 'formik';
import CloseIcon from '@material-ui/icons/Close';
import * as yup from 'yup';
import axios from 'axios';
import actions from '../../redux/actions/actions';
import * as propTypes from '../../propTypes';
import teamMembersOptions from '../forms/selectOptions/TeamMembersOptions';
import RouterLink from '../commons/RouterLink';
import issueTypeOptions from '../forms/selectOptions/issueTypeOptions';
import SubmitButton from '../forms/SubmitButton';
import {BASE_URL} from '../../api/commons';
import issueStatusOptions from '../forms/selectOptions/issueStatusOptions';
import {getTeamMembers} from '../../redux/selectors';
import DeleteIssue from './DeleteIssue';
import SelectField from '../forms/fields/SelectField';
import BasicTextField from '../forms/fields/BasicTextField';
import TextAreaField from '../forms/fields/TextAreaField';

const useStyles = makeStyles((theme) => ({
  flexContainer: {
    '& > *': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      margin: theme.spacing(2),
    },
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing(0, 2),
  },
  halfWidth: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  issueKey: {
    padding: theme.spacing(2),
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

      requestBody.list = {
        id: values.listId,
        '@type': project.backlog === values.listId ? 'Backlog' : 'Sprint',
      };

      const { data } = await axios.put(`${BASE_URL}/issues`, requestBody);
      const issueData = { ...data };
      issueData.assignee = data.assignee ? data.assignee.id : null;
      updateIssue(issueData);

      // force rerender
      history.push(`/app/projects/${project.id}/board/issues/${values.id}`);
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
              <Typography className={classes.issueKey} variant="button">{`${project.projectKey}-${issue.id}`}</Typography>
              <div>
                <DeleteIssue issue={issue} projectId={project.id} history={history} />
                <RouterLink to={`/app/projects/${project.id}/board`}>
                  <IconButton>
                    <CloseIcon />
                  </IconButton>
                </RouterLink>
              </div>
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
              {(formikProps) => (
                <Form>
                  <SelectField
                    name="type"
                    label="Issue type"
                    className={classes.halfWidth}
                    options={issueTypeOptions}
                  />
                  <SelectField
                    name="status"
                    options={issueStatusOptions}
                    className={classes.halfWidth}
                  />
                  <BasicTextField
                    formikProps={formikProps}
                    required
                    name="summary"
                  />
                  <TextAreaField name="description" />
                  <SelectField
                    name="assigneeId"
                    label="Assignee"
                    className={classes.halfWidth}
                    options={teamMembersOptions(teamMembers, userId)}
                  />
                  <BasicTextField
                    formikProps={formikProps}
                    name="storyPointsEstimate"
                    label="Story points estimate"
                    type="number"
                    inputProps={{ min: '0', step: '1' }}
                    className={classes.halfWidth}
                  />
                  {formikProps.dirty && <SubmitButton />}
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
  updateIssue: actions.updateIssue,
  setMessage: actions.setMessage,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(IssueDetails),
);
