import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Card, CardActions, CardContent, Typography,} from '@material-ui/core';
import {Form, Formik} from 'formik';
import schema from '../forms/validation/schemas/passwordRecoveryForm';
import SubmitButton from '../forms/SubmitButton';
import BasicTextField from '../forms/fields/BasicTextField';
import {requestPasswordRecovery} from '../../redux/actions/user';

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

const PasswordRecoveryRequestForm = ({ requestPasswordRecovery }) => {
  const classes = useStyles();
  const history = useHistory();

  const onSubmit = (credentials) => requestPasswordRecovery(credentials, history);

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

PasswordRecoveryRequestForm.propTypes = {
  requestPasswordRecovery: PropTypes.func.isRequired,
};

export default connect(null, { requestPasswordRecovery })(PasswordRecoveryRequestForm);
