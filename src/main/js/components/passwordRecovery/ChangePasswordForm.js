import React from 'react';
import {connect} from 'react-redux';
import {Button, Card, CardActions, CardContent, makeStyles, Typography,} from '@material-ui/core';
import PropTypes from 'prop-types';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {Form, Formik} from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import actions from '../../redux/actions/actions';
import {BASE_URL} from '../../api/commons';
import SubmitButton from '../forms/SubmitButton';
import BasicTextField from '../forms/fields/BasicTextField';

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

const ChangePasswordForm = ({ token, setMessage }) => {
  const classes = useStyles();
  const history = useHistory();

  const onSubmit = async ({ password }) => {
    try {
      await axios.put(`${BASE_URL}/users/reset-password`, {
        token,
        password,
      });
      setMessage({
        content: 'Password changed successfully',
        severity: 'success',
      });
      history.push('/signin');
    } catch (err) {
      setMessage({
        content: err.response.data,
        severity: 'error',
      });
    }
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

ChangePasswordForm.propTypes = {
  token: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  setMessage: actions.setMessage,
};

export default connect(null, mapDispatchToProps)(ChangePasswordForm);
