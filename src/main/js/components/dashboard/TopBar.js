import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {AppBar, Button, Divider, IconButton, makeStyles, MenuItem, Toolbar, Typography,} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import * as propTypes from '../../propTypes';
import creators from '../../redux/actions/creators';
import Dropdown from './Dropdown';
import RouterLink from '../commons/RouterLink';
import UserAvatar from '../commons/UserAvatar';
import {BASE_URL} from '../../api/commons';
import CreateIssue from '../CreateIssue';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up('md')]: {
      zIndex: theme.zIndex.drawer + 1,
    },
  },
  appBarLeft: {
    flexGrow: 1,
  },
  title: {
    marginRight: theme.spacing(3),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const TopBar = ({
  user, projects, handleDrawerToggle, setUser, match,
}) => {
  const classes = useStyles();

  const handleLogout = async () => {
    try {
      const { status } = await axios.post(`${BASE_URL}/logout`);
      if (status === 200) setUser(null);
    } catch (err) {
      console.log(err);
    }
  };

  const isAllProjectsUrl = match.url === '/projects' && match.isExact;
  const hasProjects = projects && projects.length;

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
                >
                  Projects
                </Button>
              )}
            >
              {projects.map((project) => (
                <RouterLink key={project.id} to={`/projects/${project.id}`}>
                  <MenuItem>{project.name}</MenuItem>
                </RouterLink>
              ))}
              <Divider />
              <RouterLink to="/projects">
                <MenuItem>view all</MenuItem>
              </RouterLink>
            </Dropdown>
          )}
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
                <UserAvatar name={user.username} isCurrentUser />
              </IconButton>
            )}
          >
            <Button onClick={handleLogout}>Log out</Button>
          </Dropdown>
        </div>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  setUser: PropTypes.func.isRequired,
  user: propTypes.user.isRequired,
  projects: PropTypes.arrayOf(propTypes.project).isRequired,
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

const mapDispatchToProps = {
  setUser: creators.setUser,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopBar));
