import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {Avatar, makeStyles} from '@material-ui/core';
import {deepOrange} from '@material-ui/core/colors';

const color = deepOrange[500];

const UserAvatar = ({
  name, classes, isCurrentUser, size, ...rest
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
    <Avatar className={clsx(size && styles[size], isCurrentUser && styles.currentUserColors)} {...rest}>
      {name[0].toUpperCase()}
    </Avatar>
  );
};

UserAvatar.defaultProps = {
  classes: [],
  isCurrentUser: false,
  size: null,
};

UserAvatar.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.arrayOf(PropTypes.string),
  isCurrentUser: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large']),
};

export default UserAvatar;
