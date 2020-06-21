import React, {useEffect} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {connect} from "react-redux";
import {Redirect, Route} from "react-router-dom";
import * as propTypes from "./propTypes";
import creators from "./redux/actions/creators";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Index from "./components/Index";
import InfoSnackbar from "./components/InfoSnackbars";
import Loading from "./components/Loading";
import PasswordRecovery from "./components/passwordRecovery/PasswordRecovery";

const App = ({ user, loading, message, setUser, setLoading, setProjects }) => {
  useEffect(() => {
    (async () => {
      try {
        const { status, data } = await axios.get("/api/users/current");
        if (status === 200) {
          const { id, username, projects } = data;
          setUser({ id, username });
          setProjects(projects);
        }
      } catch (err) {
        console.log(err.response);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <ProtectedRoute path="/projects" user={user}>
            <Dashboard />
          </ProtectedRoute>
          <Route path="/reset-password">
            <PasswordRecovery />
          </Route>
          <Route exact path="/">
            {user && <Redirect to="/projects" />}
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
  setUser: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  setProjects: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  message: state.ui.message,
  loading: state.ui.loading,
  user: state.user,
});

const mapDispatchToProps = {
  setUser: creators.setUser,
  setLoading: creators.setLoading,
  setProjects: creators.setProjects,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
