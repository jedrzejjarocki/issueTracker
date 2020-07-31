import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Link, Typography } from '@material-ui/core';

interface Props {
  to: string,
  text?: string
  [key: string]: any
}

const RouterLink: React.FC<Props> = ({
  to, text, children, ...rest
}) => (
  <Link component={ReactRouterLink} style={{ textDecoration: 'none', color: 'inherit' }} to={to} {...rest}>
    {children || <Typography>{text}</Typography>}
  </Link>
);

export default RouterLink;
