import {Redirect, Route} from 'react-router-dom';
import React from 'react';
import * as propTypes from '../propTypes';

const ProtectedRoute = ({ children, user, ...rest }) => (
  <Route
    {...rest}
    render={({ location }) => (user ? (
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

ProtectedRoute.defaultProps = {
  user: null,
};

ProtectedRoute.propTypes = {
  children: propTypes.children.isRequired,
  user: propTypes.user,
};

export default ProtectedRoute;
