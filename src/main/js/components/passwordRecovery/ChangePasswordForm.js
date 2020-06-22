import React from 'react';
import {connect} from 'react-redux';
import {Button, Card, CardActions, CardContent, makeStyles, Typography,} from '@material-ui/core';
import PropTypes from 'prop-types';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {Form, Formik} from 'formik';
import axios from 'axios';
import {TextField} from 'material-ui-formik-components/TextField';
import * as yup from 'yup';
import creators from '../../redux/actions/creators';
import {BASE_URL} from '../../api/commons';
import FormField from '../forms/FormField';
import SubmitButton from '../forms/SubmitButton';

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

const schema = yup.object().shape({
  password: yup.string().required('Must be 8 characters or more'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const ChangePasswordForm = ({ token }) => {
  const classes = useStyles();
  const history = useHistory();

  const onSubmit = async ({ password, setMessage }) => {
    let redirectPath;
    try {
      await axios.put(`${BASE_URL}/users/reset-password`, {
        token,
        password,
      });
      setMessage({
        content: 'Password changed successfully',
        severity: 'success',
      });
      redirectPath = '/login';
    } catch (err) {
      setMessage({
        content: err.response.data,
        severity: 'error',
      });
    }
    if (redirectPath) history.push(redirectPath);
  };

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
        {({ errors, touched }) => (
          <Form>
            <CardContent>
              <Typography variant="h6" component="h2">
                Change password
              </Typography>
              <FormField
                required
                error={errors.password}
                touched={touched.password}
                type="password"
                name="password"
                component={TextField}
              />
              <TextField
                required
                name="confirmPassword"
                type="password"
                label="Confirm password"
                error={errors.confirmPassword}
                component={TextField}
              />
            </CardContent>
            <CardActions className={classes.justifyRight}>
              <RouterLink to="/">
                <Button color="primary">Cancel</Button>
              </RouterLink>
              <SubmitButton errors={errors} text="Change" />
            </CardActions>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

ChangePasswordForm.propTypes = {
  token: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  setMessage: creators.setMessage,
};

export default connect(null, mapDispatchToProps)(ChangePasswordForm);
