import React from 'react';
import clsx from 'clsx';
import { Avatar, makeStyles } from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import { getUser } from '../../redux/user/selectors';

const color = deepOrange[500];

type Props = {
  username: string
  userId?: number
  currentUser?: boolean
  size?: 'small' | 'large'
  style?: any
};

const UserAvatar: React.FC<Props & ReduxProps> = (props) => {
  const {
    username,
    size,
    currentUserId,
    currentUser,
    userId,
    ...rest
  } = props;

  const styles = makeStyles((theme) => ({
    currentUserColors: {
      color: theme.palette.getContrastText(color),
      backgroundColor: color,
    },
    large: {
      width: theme.spacing(8),
      height: theme.spacing(8),
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
  }))();

  const isCurrentUser = currentUser || currentUserId === userId;

  return (
    <Avatar
      className={clsx(size && styles[size], isCurrentUser && styles.currentUserColors)}
      {...rest}
    >
      {username[0].toUpperCase()}
    </Avatar>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentUserId: getUser(state)!.id,
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(UserAvatar);
