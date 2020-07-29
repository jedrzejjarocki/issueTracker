import { Redirect, Route } from 'react-router-dom';
import React from 'react';
import { User } from '../entities/User';

interface Props {
  user: User
  path: string
}

const ProtectedRoute: React.FC<Props> = ({ children, user, ...rest }) => (
  <Route
    {...rest}
    render={({ location }) => (user && user.get('id') ? (
      children
    ) : (
      <Redirect
        to={{
          pathname: '/',
          state: { from: location },
        }}
      />
    ))}
  />
);

export default ProtectedRoute;
