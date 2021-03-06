import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  AppBar, Button, Divider, IconButton, makeStyles, MenuItem, Toolbar, Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import { fetchLogout } from '../../redux/user/actionCreators';
import Dropdown from './Dropdown';
import RouterLink from '../commons/RouterLink';
import UserAvatar from '../commons/UserAvatar';
import CreateIssue from './CreateIssue';
import { RootState } from '../../redux/rootReducer';
import { getUser } from '../../redux/user/selectors';
import { getProjectsAsArray } from '../../redux/projects/selectors';

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
    '& > *:not(:first-child)': {
      marginRight: theme.spacing(2),
    },
  },
  menuButton: {
    marginLeft: '-12px',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

interface Props extends RouteComponentProps<any>, ReduxProps {
  handleDrawerToggle: () => void;
}

const TopBar: React.FC<Props> = ({
  username, projects, handleDrawerToggle, fetchLogout: logout, match,
}) => {
  const classes = useStyles();

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
          <Typography variant="h6" color="primary">
            IssueTracker
          </Typography>
          {!isAllProjectsUrl && hasProjects && (
            <Dropdown
              render={(
                ref: React.MutableRefObject<any>,
                ariaHaspopup: boolean,
                onClick: () => void,
              ) => (
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
              {projects.map((project) => (
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
            render={(
              ref: React.MutableRefObject<any>,
              ariaHaspopup: boolean,
              onClick: () => void,
            ) => (
              <IconButton
                ref={ref}
                aria-haspopup={ariaHaspopup}
                onClick={onClick}
              >
                <UserAvatar username={username} currentUser size="small" />
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

const mapStateToProps = (state: RootState) => ({
  username: getUser(state)!.get('username'),
  projects: getProjectsAsArray(state),
});

const connector = connect(mapStateToProps, { fetchLogout });
type ReduxProps = ConnectedProps<typeof connector>;

export default withRouter(connector(TopBar));
