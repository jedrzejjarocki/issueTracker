import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  Card, Grid, IconButton, makeStyles, Typography,
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import CloseIcon from '@material-ui/icons/Close';
import schema, { UpdateIssueFormFields } from '../forms/validation/schemas/updateIssue';
import teamMembersOptions from '../forms/selectOptions/TeamMembersOptions';
import RouterLink from '../commons/RouterLink';
import issueTypeOptions from '../forms/selectOptions/issueTypeOptions';
import SubmitButton from '../forms/SubmitButton';
import { fetchUpdateIssue, IssueRequestBody } from '../../redux/issues/actionCreators';
import issueStatusOptions from '../forms/selectOptions/issueStatusOptions';
import DeleteIssue from './DeleteIssue';
import SelectField from '../forms/fields/SelectField';
import BasicTextField from '../forms/fields/BasicTextField';
import TextAreaField from '../forms/fields/TextAreaField';
import { RootState } from '../../redux/rootReducer';
import { getUser } from '../../redux/user/selectors';
import { getTeamMembersByProjectId } from '../../redux/teamMembers/selectors';
import { getIssueById } from '../../redux/issues/selectors';
import Project from '../../entities/Project';

const useStyles = makeStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(0, 2),
  },
  halfWidth: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  submitButton: {
    marginBottom: theme.spacing(2),
  },
}));

export interface Props extends RouteComponentProps<any>, ReduxProps{
  project: Project,
}

const IssueDetails: React.FC<Props> = ({
  project,
  issue,
  userId,
  fetchUpdateIssue: fetchUpdate,
  history,
  teamMembers,
}) => {
  const classes = useStyles();

  const onSubmit = (values: UpdateIssueFormFields) => {
    const request: IssueRequestBody = {
      id: values.id,
      container: {
        id: values.containerId,
        '@type': project.backlog === values.containerId ? 'Backlog' : 'Sprint',
      },
      version: values.version,
      priority: values.priority,
      type: values.type,
      status: values.status,
      summary: values.summary,
      description: values.description,
      assignee: values.assigneeId ? {
        id: values.assigneeId,
      } : null,
      storyPointsEstimate: values.storyPointsEstimate,
    };

    fetchUpdate(request, project.id, history);
  };

  return (
    <>
      {project && issue && (
        <Grid item xs={4} lg={5}>
          <Card variant="outlined">
            <Grid container className={classes.header} wrap="nowrap" direction="row" justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="button">{`${project.projectKey}-${issue.id}`}</Typography>
              </Grid>
              <Grid item>
                <DeleteIssue issue={issue} projectId={project.id} history={history} />
                <RouterLink to={`/app/projects/${project.id}/board`}>
                  <IconButton>
                    <CloseIcon />
                  </IconButton>
                </RouterLink>
              </Grid>
            </Grid>
            <Formik
              enableReinitialize
              onSubmit={onSubmit}
              initialValues={{
                id: issue.id,
                version: issue.version,
                priority: issue.priority,
                type: issue.type,
                summary: issue.summary,
                status: issue.status,
                containerId: issue.containerId,
                description: issue.description,
                assigneeId: issue.assignee || 0,
                storyPointsEstimate: issue.storyPointsEstimate,
              }}
              validationSchema={schema}
            >
              {(formikProps) => (
                <Form className={classes.form}>
                  <SelectField
                    name="type"
                    label="Issue type"
                    className={classes.halfWidth}
                    options={issueTypeOptions}
                  />
                  <SelectField
                    name="status"
                    className={classes.halfWidth}
                    options={issueStatusOptions}
                  />
                  <BasicTextField
                    name="summary"
                    formikProps={formikProps}
                    required
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
                  {formikProps.dirty && <SubmitButton className={classes.submitButton} />}
                </Form>
              )}
            </Formik>
          </Card>
        </Grid>
      )}
    </>
  );
};

const mapStateToProps = (
  state: RootState,
  props: RouteComponentProps<{ issueId: string, projectId: string}>,
) => {
  const { issueId, projectId } = props.match.params;
  return {
    issue: getIssueById(state, issueId),
    userId: getUser(state)!.id,
    teamMembers: getTeamMembersByProjectId(state, projectId),
  };
};

const connector = connect(mapStateToProps, { fetchUpdateIssue });

type ReduxProps = ConnectedProps<typeof connector>;

export default withRouter(
  connector(IssueDetails),
);
