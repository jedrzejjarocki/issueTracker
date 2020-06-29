import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {useLocation} from 'react-router-dom';
import schema from './validation/schemas/registerForm';
import DialogForm from './DialogForm';
import BasicTextField from './fields/BasicTextField';
import {register} from '../../redux/actions/user';

const RegisterForm = ({ register, isOpen }) => {
  const [responseError, setResponseError] = useState(null);

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const token = useLocation().search.split('=')[1];

  const onSubmit = ({ username, password, email }, _, toggle) => {
    const user = { username, password, email };
    register(user, token, toggle);
  };

  return (
    <>
      <DialogForm
        toggleButtonText="Sign up"
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={schema}
        title="Sign up"
        submitButtonText="Sign up"
        closeOnSubmit={false}
        isOpen={isOpen}
        renderFields={(formikProps) => (
          <>
            <BasicTextField
              autoFocus
              required
              formikProps={formikProps}
              name="username"
              error={responseError}
            />
            <BasicTextField
              required
              formikProps={formikProps}
              name="email"
            />
            <BasicTextField
              required
              formikProps={formikProps}
              name="password"
              type="password"
            />
            <BasicTextField
              required
              formikProps={formikProps}
              name="confirmPassword"
              type="password"
              label="Confirm password"
            />
          </>
        )}
      />
    </>
  );
};

RegisterForm.propTypes = {
  register: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default connect(null, { register })(RegisterForm);
