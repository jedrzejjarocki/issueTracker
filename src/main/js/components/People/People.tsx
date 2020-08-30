import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Grid } from '@material-ui/core';
import InviteUser from './InviteUser';
import { RootState } from '../../redux/rootReducer';
import { getUser } from '../../redux/user/selectors';
import UserCard from './UserCard';
import { getUsersWithTheirProjects } from '../../redux/compoundSelectors';

const People: React.FC<ReduxProps> = ({ usersWithProjects, currentUserId }) => (
  <>
    <Grid container item spacing={3}>
      {usersWithProjects.map((user) => (
        <UserCard userWithProjects={user} currentUserId={currentUserId} />
      ))}
    </Grid>
    <InviteUser />
  </>
);

const mapStateToProps = (state: RootState) => ({
  usersWithProjects: getUsersWithTheirProjects(state),
  currentUserId: getUser(state)!.id,
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(People);
