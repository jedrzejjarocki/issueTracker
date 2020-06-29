import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Card, CardActions, CardContent, Typography,} from '@material-ui/core';
import {Form, Formik} from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import {TextField} from 'material-ui-formik-components/TextField';
import actions from '../../redux/actions/actions';
import {BASE_URL} from '../../api/commons';
import SubmitButton from '../forms/SubmitButton';
import FormField from '../forms/FormField';

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
  email: yup.string().email('Must be valid email').required('Required'),
});

const PasswordRecoveryRequestForm = ({ setMessage }) => {
  const classes = useStyles();
  const history = useHistory();

  const onSubmit = async (credentials) => {
    try {
      await axios.post(`${BASE_URL}/users/reset-password`, credentials);
      setMessage({
        content: 'Check your email for password recovery link',
        severity: 'success',
      });
      history.push('/');
    } catch (err) {
      if (err.response.status === 401) {
        setMessage({
          content: "User with a given email does't exists",
          severity: 'error',
        });
      }
    }
  };

  return (
    <Card variant="outlined">
      <Formik
        initialValues={{
          email: '',
        }}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {({ errors, touched }) => (
          <Form>
            <CardContent>
              <Typography variant="h6" component="h2">
                Reset email
              </Typography>
              <FormField
                required
                autoFocus
                error={errors.email}
                touched={touched.email}
                name="email"
                component={TextField}
              />
            </CardContent>
            <CardActions className={classes.justifyRight}>
              <RouterLink to="/">
                <Button color="primary">Cancel</Button>
              </RouterLink>
              <SubmitButton errors={errors} text="Send email" />
            </CardActions>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

PasswordRecoveryRequestForm.propTypes = {
  setMessage: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  setMessage: actions.setMessage,
};

export default connect(null, mapDispatchToProps)(PasswordRecoveryRequestForm);
