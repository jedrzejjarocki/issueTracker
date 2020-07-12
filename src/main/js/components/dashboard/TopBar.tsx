import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {AppBar, Button, Divider, IconButton, makeStyles, MenuItem, Toolbar, Typography,} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import {fetchLogout} from '../../redux/actions/user/creators';
import Dropdown from './Dropdown';
import RouterLink from '../commons/RouterLink';
import UserAvatar from '../commons/UserAvatar';
import CreateIssue from './CreateIssue';
import {RootState} from '../../redux/reducers/rootReducer';
import {getUser} from '../../redux/selectors/user';
import {getProjectsAsArray} from '../../redux/selectors/project';

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

interface Props extends RouteComponentProps<any>, ReduxProps {
  handleDrawerToggle: () => void;
}

const TopBar: React.FC<Props> = ({
  user, projects, handleDrawerToggle, fetchLogout, match,
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
              render={(ref: React.MutableRefObject<any>, ariaHaspopup: boolean, onClick: () => void) => (
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
            render={(ref: React.MutableRefObject<any>, ariaHaspopup: boolean, onClick: () => void): React.ReactNode => (
              <IconButton
                ref={ref}
                aria-haspopup={ariaHaspopup}
                onClick={onClick}
              >
                <UserAvatar name={user.username} isCurrentUser size="small" />
              </IconButton>
            )}
          >
            <Button onClick={fetchLogout}>Log out</Button>
          </Dropdown>
        </div>
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: getUser(state),
  projects: getProjectsAsArray(state),
});

const connector = connect(mapStateToProps, { fetchLogout });
type ReduxProps = ConnectedProps<typeof connector>;

export default withRouter(connector(TopBar));
