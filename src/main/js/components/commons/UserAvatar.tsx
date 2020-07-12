import React from 'react';
import clsx from 'clsx';
import {Avatar, makeStyles} from '@material-ui/core';
import {deepOrange} from '@material-ui/core/colors';

const color = deepOrange[500];

interface Props {
  name: string,
  isCurrentUser?: boolean,
  size?: 'small' | 'large'
}

const UserAvatar: React.FC<Props> = ({
  name, isCurrentUser, size, ...rest
}) => {
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

  return (
    <Avatar
      className={clsx(size && styles[size], isCurrentUser && styles.currentUserColors)}
      {...rest}
    >
      {name[0].toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar;
