import React from "react";
import PropTypes from "prop-types";
import {Link as ReactRouterLink} from "react-router-dom";
import {Link, Typography} from "@material-ui/core";

const RouterLink = ({ to, text, children, ...rest }) => (
  <Link component={ReactRouterLink} to={to} {...rest}>
    {children || <Typography>{text}</Typography>}
  </Link>
);

RouterLink.defaultProps = {
  children: null,
  text: null,
};

RouterLink.propTypes = {
  to: PropTypes.string.isRequired,
  text: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default RouterLink;
