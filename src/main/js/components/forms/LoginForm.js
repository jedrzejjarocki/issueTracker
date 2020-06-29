import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import axios from 'axios';
import * as yup from 'yup';
import DialogForm from './DialogForm';
import actions from '../../redux/actions/actions';
import RouterLink from '../commons/RouterLink';
import {BASE_URL} from '../../api/commons';
import BasicTextField from './fields/BasicTextField';

const LoginForm = ({ setUser, setMessage, isOpen }) => {
  const schema = yup.object().shape({
    username: yup.string().required('Required'),
    password: yup.string().required('Must not be empty'),
  });

  const initialValues = {
    username: '',
    password: '',
  };

  const onSubmit = async (credentials) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/login`, credentials);
      const { id, username } = data;
      setUser({ id, username });
    } catch (error) {
      setMessage({
        content: 'Incorrect username or password',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <DialogForm
        toggleButtonText="Sign in"
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={schema}
        title="Sign in"
        submitButtonText="Sign in"
        isOpen={isOpen}
        renderFields={(formikProps) => (
          <>
            <BasicTextField
              autoFocus
              name="username"
              formikProps={formikProps}
            />
            <BasicTextField
              name="password"
              type="password"
              formikProps={formikProps}
            />
          </>
        )}
        renderAdditionalActions={() => (
          <RouterLink text="forgot password?" to="/reset-password" />
        )}
      />
    </>
  );
};

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  setUser: actions.setUser,
  setMessage: actions.setMessage,
};

export default connect(null, mapDispatchToProps)(LoginForm);
