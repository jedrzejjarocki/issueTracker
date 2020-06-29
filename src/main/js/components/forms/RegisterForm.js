import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import axios from 'axios';
import * as yup from 'yup';
import {useLocation} from 'react-router-dom';
import actions from '../../redux/actions/actions';
import {BASE_URL} from '../../api/commons';
import DialogForm from './DialogForm';
import BasicTextField from './fields/BasicTextField';

const schema = yup.object().shape({
  username: yup.string().required('Must not be empty'),
  email: yup.string().email('Must be valid email'),
  password: yup.string().min(8, 'Must be at least 8 characters long')
    .max(128, 'Must be at most 128 characters long')
    .required('Must be 8 characters or more'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const RegisterForm = ({ setMessage, isOpen }) => {
  const [responseError, setResponseError] = useState(null);

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const token = useLocation().search.split('=')[1];

  const onSubmit = async ({ username, password, email }, _, toggle) => {
    try {
      let url = `${BASE_URL}/users`;
      if (token) url += `?token=${token}`;
      const { status } = await axios.post(url, {
        username,
        password,
        email,
      });

      if (status === 201) {
        setMessage({
          content: 'Account created!',
          severity: 'success',
        });
        toggle();
      }
    } catch (err) {
      setResponseError(err.response.data.message);
    }
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
              autofocus
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
  setMessage: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  setMessage: actions.setMessage,
};

export default connect(null, mapDispatchToProps)(RegisterForm);
