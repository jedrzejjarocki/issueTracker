import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import schema from './validation/schemas/loginForm';
import DialogForm from './DialogForm';
import RouterLink from '../commons/RouterLink';
import BasicTextField from './fields/BasicTextField';
import {fetchLogin} from '../../redux/user/actionCreators';

interface Props extends ReduxProps{
  isOpen: boolean
}

const LoginForm: React.FC<Props> = ({ fetchLogin, isOpen }) => {
  const initialValues = {
    username: '',
    password: '',
  };

  return (
    <>
      <DialogForm
        toggleButtonText="Sign in"
        initialValues={initialValues}
        onSubmit={fetchLogin}
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

const connector = connect(null, { fetchLogin });
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(LoginForm);
