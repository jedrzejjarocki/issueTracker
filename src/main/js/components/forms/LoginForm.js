import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import schema from './validation/schemas/loginForm';
import DialogForm from './DialogForm';
import RouterLink from '../commons/RouterLink';
import BasicTextField from './fields/BasicTextField';
import {login} from '../../redux/actions/user';

const LoginForm = ({ login, isOpen }) => {
  const initialValues = {
    username: '',
    password: '',
  };

  return (
    <>
      <DialogForm
        toggleButtonText="Sign in"
        initialValues={initialValues}
        onSubmit={login}
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
  login: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default connect(null, { login })(LoginForm);
