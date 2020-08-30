import React, { Fragment } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Divider, Link, List, ListItem, ListItemText, makeStyles, Paper, Typography,
} from '@material-ui/core';
import CreateProject from '../issuesList/CreateProject';
import Loading from '../Loading';
import { RootState } from '../../redux/rootReducer';
import { getProjectsAsArray } from '../../redux/projects/selectors';
import { getLoading } from '../../redux/ui/selectors';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
  },
  list: {
    padding: 0,
  },
  itemDetails: {
    display: 'flex',
    '& > *': {
      marginLeft: theme.spacing(1),
    },
  },
  infoText: {
    marginBottom: theme.spacing(2),
  },
}));

const ProjectsList: React.FC<ReduxProps> = ({ projects, loading }) => {
  const classes = useStyles();
  if (loading) return <Loading />;

  return (
    <>
      {projects.length ? (
        <>
          <Paper elevation={2} variant="outlined" className={classes.root}>
            <List dense className={classes.list}>
              {projects.map((project, idx, arr) => (
                <Fragment key={project.id}>
                  <Link component={RouterLink} to={`/app/projects/${project.get('id')}`}>
                    <ListItem button>
                      <ListItemText primary={project.get('name')} />
                    </ListItem>
                  </Link>
                  {idx !== arr.length - 1 && <Divider />}
                </Fragment>
              ))}
            </List>
          </Paper>
          <CreateProject />
        </>
      ) : (
        <>
          <Typography color="textSecondary" className={classes.infoText}>
            Projects list is empty
          </Typography>
          <CreateProject first />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  projects: getProjectsAsArray(state),
  loading: getLoading(state),
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(ProjectsList);
