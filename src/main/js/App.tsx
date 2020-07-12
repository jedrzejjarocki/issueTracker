import React from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';
import Index from './components/Index';
import InfoSnackbar from './components/InfoSnackbars';
import Loading from './components/Loading';
import useFetchInitialData from './hooks/useFetchInitialData';
import {Message, User} from './propTypes';
import {RootState} from './redux/reducers/rootReducer';

interface Props {
  user: User
  loading: boolean
  message: Message
}

const App: React.FC<Props> = ({ user, loading, message }) => {
  useFetchInitialData(user ? user.id : null);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Switch>
            <ProtectedRoute path="/app" user={user}>
              <Dashboard />
            </ProtectedRoute>
            <Route path="/">
              {user && <Redirect to="/app/projects" />}
              <Index />
            </Route>
          </Switch>
          {message && <InfoSnackbar message={message} />}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  state,
  message: state.ui.message,
  loading: state.ui.loading,
  user: state.user,
});

export default connect(mapStateToProps)(App);
