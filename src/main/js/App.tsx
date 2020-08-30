import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  BrowserRouter as Router, Redirect, Route, Switch,
} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';
import Index from './components/Index';
import InfoSnackbar from './components/InfoSnackbars';
import Loading from './components/Loading';
import useFetchInitialData from './hooks/useFetchInitialData';
import { RootState } from './redux/rootReducer';
import { getUser } from './redux/user/selectors';
import { getLoading, getMessage } from './redux/ui/selectors';

const App: React.FC<ReduxProps> = ({ loading, message, user }) => {
  useFetchInitialData(user ? user.get('id') : null);
  return (
    <Router>
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
    </Router>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: getUser(state),
  loading: getLoading(state),
  message: getMessage(state),
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(App);
