import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {useLocation} from 'react-router-dom';
import schema from './validation/schemas/registerForm';
import DialogForm from './DialogForm';
import BasicTextField from './fields/BasicTextField';
import {fetchRegister, RegisterRequestBody} from '../../redux/actions/user/creators';

interface Props extends ReduxProps{
  isOpen: boolean
}

const RegisterForm: React.FC<Props> = ({ fetchRegister, isOpen }) => {
  const [responseError, setResponseError] = useState(null);

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const token = useLocation().search.split('=')[1];

  const onSubmit = (values: RegisterRequestBody, _: any, toggle: () => void) => {
    fetchRegister(values, token, toggle, setResponseError);
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

const connector = connect(null, { fetchRegister })
type ReduxProps = ConnectedProps<typeof connector>

export default connector(RegisterForm);
