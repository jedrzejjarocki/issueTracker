import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button, Card, CardActions, CardContent, Typography,
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import schema from '../forms/validation/schemas/passwordRecoveryForm';
import SubmitButton from '../forms/SubmitButton';
import BasicTextField from '../forms/fields/BasicTextField';
import { fetchRequestPasswordRecovery } from '../../redux/user/actionCreators';

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

const PasswordRecoveryRequestForm: React.FC<ReduxProps> = ({ fetchRequestPasswordRecovery: requestPasswordRecovery }) => {
  const classes = useStyles();
  const history = useHistory();

  interface PasswordRecoveryFormFields {
    email: string
  }

  const onSubmit = (credentials: PasswordRecoveryFormFields) => requestPasswordRecovery(credentials, history);

  return (
    <Card variant="outlined">
      <Formik
        initialValues={{
          email: '',
        }}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {(formikProps) => (
          <Form>
            <CardContent>
              <Typography variant="h6" component="h2">
                Reset email
              </Typography>
              <BasicTextField
                formikProps={formikProps}
                required
                autoFocus
                name="email"
              />
            </CardContent>
            <CardActions className={classes.justifyRight}>
              <RouterLink to="/">
                <Button color="primary">Cancel</Button>
              </RouterLink>
              <SubmitButton errors={formikProps.errors} text="Send email" />
            </CardActions>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

const connector = connect(null, { fetchRequestPasswordRecovery });
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(PasswordRecoveryRequestForm);
