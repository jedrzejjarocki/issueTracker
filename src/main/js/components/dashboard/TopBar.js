import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {AppBar, Button, Divider, IconButton, makeStyles, MenuItem, Toolbar, Typography,} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import {logout} from '../../redux/actions/user';
import * as propTypes from '../../propTypes';
import Dropdown from './Dropdown';
import RouterLink from '../commons/RouterLink';
import UserAvatar from '../commons/UserAvatar';
import CreateIssue from './CreateIssue';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up('md')]: {
      zIndex: theme.zIndex.drawer + 1,
    },
  },
  appBarLeft: {
    flexGrow: 1,
    padding: 0,
    '& button': {
      margin: theme.spacing(0, 1),
    },
  },
  title: {
    marginRight: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const TopBar = ({
  user, projects, handleDrawerToggle, logout, match,
}) => {
  const classes = useStyles();

  const isAllProjectsUrl = match.url === '/projects' && match.isExact;
  const hasProjects = projects && Object.keys(projects).length;

  return (
    <AppBar position="fixed" className={classes.appBar} variant="outlined">
      <Toolbar>
        <Toolbar className={classes.appBarLeft}>
          <IconButton
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="primary" className={classes.title}>
            IssueTracker
          </Typography>
          {!isAllProjectsUrl && hasProjects && (
            <Dropdown
              render={(ref, ariaHaspopup, onClick) => (
                <Button
                  ref={ref}
                  aria-haspopup={ariaHaspopup}
                  onClick={onClick}
                  endIcon={<ExpandMoreOutlinedIcon />}
                >
                  Projects
                </Button>
              )}
            >
              {Object.values(projects).map((project) => (
                <RouterLink key={project.id} to={`/app/projects/${project.id}/board`}>
                  <MenuItem>{project.name}</MenuItem>
                </RouterLink>
              ))}
              <Divider />
              <RouterLink to="/app/projects">
                <MenuItem>view all</MenuItem>
              </RouterLink>
            </Dropdown>
          )}
          <RouterLink to="/app/people">
            <Button>
              People
            </Button>
          </RouterLink>
          <CreateIssue />
        </Toolbar>
        <div>
          <Dropdown
            render={(ref, ariaHaspopup, onClick) => (
              <IconButton
                ref={ref}
                aria-haspopup={ariaHaspopup}
                onClick={onClick}
              >
                <UserAvatar name={user.username} isCurrentUser size="small" />
              </IconButton>
            )}
          >
            <Button onClick={logout}>Log out</Button>
          </Dropdown>
        </div>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  logout: PropTypes.func.isRequired,
  user: propTypes.user.isRequired,
  projects: PropTypes.objectOf(propTypes.project).isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    isExact: PropTypes.bool.isRequired,
  }).isRequired,
};

const mapStateToProps = ({ user, projects }) => ({
  user,
  projects,
});

export default withRouter(connect(mapStateToProps, { logout })(TopBar));
