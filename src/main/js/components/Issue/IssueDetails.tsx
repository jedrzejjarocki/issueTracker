import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {Card, Grid, IconButton, makeStyles, Typography,} from '@material-ui/core';
import {Form, Formik} from 'formik';
import CloseIcon from '@material-ui/icons/Close';
import schema, {UpdateIssueFormFields} from '../forms/validation/schemas/updateIssue';
import teamMembersOptions from '../forms/selectOptions/TeamMembersOptions';
import RouterLink from '../commons/RouterLink';
import issueTypeOptions from '../forms/selectOptions/issueTypeOptions';
import SubmitButton from '../forms/SubmitButton';
import {fetchUpdateIssue, IssueRequestBody} from '../../redux/issues/actionCreators';
import issueStatusOptions from '../forms/selectOptions/issueStatusOptions';
import DeleteIssue from './DeleteIssue';
import SelectField from '../forms/fields/SelectField';
import BasicTextField from '../forms/fields/BasicTextField';
import TextAreaField from '../forms/fields/TextAreaField';
import {RootState} from '../../redux/rootReducer';
import {getUser} from '../../redux/user/selectors';
import {getTeamMembersByProjectId} from '../../redux/teamMembers/selectors';
import {getIssueById} from '../../redux/issues/selectors';
import Project from '../../entities/Project';

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

export interface Props extends RouteComponentProps<any>, ReduxProps{
  project: Project,
}

const IssueDetails: React.FC<Props> = ({
  project, issue, userId, fetchUpdateIssue, history, teamMembers,
}) => {
  const classes = useStyles();

  const onSubmit = (values: UpdateIssueFormFields) => {
    const request: IssueRequestBody = {
      id: values.id,
      list: {
        id: values.listId,
        '@type': project.backlog === values.listId ? 'Backlog' : 'Sprint',
      },
      version: values.version,
      type: values.type,
      status: values.status,
      summary: values.summary,
      description: values.description,
      assignee: values.assigneeId ? {
        id: values.assigneeId,
      } : null,
      storyPointsEstimate: values.storyPointsEstimate,
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
              } as UpdateIssueFormFields}
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

const mapStateToProps = (state: RootState, props: RouteComponentProps<{ issueId: string, projectId: string}>) => {
  const { issueId, projectId } = props.match.params;
  return {
    issue: getIssueById(state, issueId),
    userId: getUser(state).id,
    teamMembers: getTeamMembersByProjectId(state, projectId),
  };
};

const connector = connect(mapStateToProps, { fetchUpdateIssue });

type ReduxProps = ConnectedProps<typeof connector>;

export default withRouter(
  connector(IssueDetails),
);
