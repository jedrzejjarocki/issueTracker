import React from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {getUserRoleByProjectId} from '../redux/selectors';

const withAuth = (Component) => (props) => <Component {...props} />;

const mapStateToProps = (state, { projectId }) => ({
  userRole: getUserRoleByProjectId(state.user.id, projectId, state),
});

export default compose(connect(mapStateToProps), withAuth);
