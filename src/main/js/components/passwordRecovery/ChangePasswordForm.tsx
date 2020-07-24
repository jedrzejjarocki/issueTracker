import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Button, Card, CardActions, CardContent, makeStyles, Typography,} from '@material-ui/core';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {Form, Formik} from 'formik';
import schema from '../forms/validation/schemas/changePasswordForm';
import SubmitButton from '../forms/SubmitButton';
import BasicTextField from '../forms/fields/BasicTextField';
import {fetchChangePassword} from '../../redux/user/actionCreators';

const useStyles = makeStyles((theme) => ({
  flexContainer: {
    '& > *': {
      display: 'flex',
      flexDirection: 'column',
      margin: theme.spacing(2, 0),
      width: '40ch',
      height: '200',
    },
  },
  justifyRight: {
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 2, 2),
  },
}));

interface Props extends ReduxProps {
  token?: string
}

const ChangePasswordForm: React.FC<Props> = ({ token, fetchChangePassword: fetchChange }) => {
  const classes = useStyles();
  const history = useHistory();

  interface ChangePasswordFormFields {
    password: string
    confirmPassword: string
  }

  const onSubmit = ({ password }: ChangePasswordFormFields) => fetchChange(password, token, history);

  return (
    <Card variant="outlined">
      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {(formikProps) => (
          <Form>
            <CardContent>
              <Typography variant="h6" component="h2">
                Change password
              </Typography>
              <BasicTextField
                formikProps={formikProps}
                required
                type="password"
                name="password"
              />
              <BasicTextField
                required
                name="confirmPassword"
                label="Confirm password"
                type="password"
                formikProps={formikProps}
              />
            </CardContent>
            <CardActions className={classes.justifyRight}>
              <RouterLink to="/">
                <Button color="primary">Cancel</Button>
              </RouterLink>
              <SubmitButton errors={formikProps.errors} text="Change" />
            </CardActions>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

const connector = connect(null, { fetchChangePassword });
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(ChangePasswordForm);
