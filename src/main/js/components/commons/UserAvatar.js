import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {Avatar, makeStyles} from "@material-ui/core";
import {deepOrange} from "@material-ui/core/colors";

const color = deepOrange[500];

const UserAvatar = ({ name, classes, isCurrentUser, ...rest }) => {
  const { currentUserColors } = makeStyles((theme) => ({
    currentUserColors: {
      color: theme.palette.getContrastText(color),
      backgroundColor: color,
    },
  }))();

  const styles = classes ? [...classes] : [];
  if (isCurrentUser) styles.push(currentUserColors);

  return (
    <Avatar className={clsx(...styles)} {...rest}>
      {name[0].toUpperCase()}
    </Avatar>
  );
};

UserAvatar.defaultProps = {
  classes: [],
  isCurrentUser: false,
};

UserAvatar.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.arrayOf(PropTypes.string),
  isCurrentUser: PropTypes.bool,
};

export default UserAvatar;
