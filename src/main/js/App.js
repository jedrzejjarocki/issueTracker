import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect, Route} from 'react-router-dom';
import * as propTypes from './propTypes';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';
import Index from './components/Index';
import InfoSnackbar from './components/InfoSnackbars';
import Loading from './components/Loading';
import PasswordRecovery from './components/passwordRecovery/PasswordRecovery';
import useFetchInitialData from './hooks/useFetchInitialData';

const App = ({ user, loading, message }) => {
  useFetchInitialData(user ? user.id : null);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>

          <ProtectedRoute path="/app" user={user}>
            <Dashboard />
          </ProtectedRoute>
          <Route path="/reset-password">
            <PasswordRecovery />
          </Route>
          <Route exact path="/">
            {user && <Redirect to="/app/projects" />}
            <Index />
          </Route>
          {message && <InfoSnackbar message={message} />}
        </>
      )}
    </>
  );
};

App.defaultProps = {
  user: null,
  message: null,
};

App.propTypes = {
  user: propTypes.user,
  loading: PropTypes.bool.isRequired,
  message: propTypes.message,
};

const mapStateToProps = (state) => ({
  state,
  message: state.ui.message,
  loading: state.ui.loading,
  user: state.user,
});

export default connect(mapStateToProps)(App);
