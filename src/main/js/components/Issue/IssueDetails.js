import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Card, Grid, IconButton, makeStyles, Typography,} from '@material-ui/core';
import {Form, Formik} from 'formik';
import CloseIcon from '@material-ui/icons/Close';
import schema from '../forms/validation/schemas/updateIssue';
import * as propTypes from '../../propTypes';
import teamMembersOptions from '../forms/selectOptions/TeamMembersOptions';
import RouterLink from '../commons/RouterLink';
import issueTypeOptions from '../forms/selectOptions/issueTypeOptions';
import SubmitButton from '../forms/SubmitButton';
import {fetchUpdateIssue} from '../../redux/actions/issue';
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

const IssueDetails = ({
  project, issue, userId, fetchUpdateIssue, history, teamMembers,
}) => {
  const classes = useStyles();

  const onSubmit = (values) => {
    const request = { ...values };
    delete request.assigneeId;
    delete request.listId;

    request.assignee = values.assigneeId
      ? {
        id: values.assigneeId,
      }
      : null;

    request.list = {
      id: values.listId,
      '@type': project.backlog === values.listId ? 'Backlog' : 'Sprint',
    };
    fetchUpdateIssue(request, project.id, history);
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
  fetchUpdateIssue: PropTypes.func.isRequired,
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

export default withRouter(
  connect(mapStateToProps, { fetchUpdateIssue })(IssueDetails),
);
