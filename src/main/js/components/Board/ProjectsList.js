import React from 'react';
import {connect} from 'react-redux';
import {Link as RouterLink} from 'react-router-dom';
import {Divider, Link, List, ListItem, ListItemText, makeStyles, Paper, Typography,} from '@material-ui/core';
import PropTypes from 'prop-types';
import * as propTypes from '../../propTypes';
import CreateProject from '../issuesList/CreateProject';
import Loading from '../Loading';

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

const ProjectsList = ({ projects, loading }) => {
  const classes = useStyles();

  if (loading) return <Loading />;

  return (
    <>
      {Object.keys(projects).length ? (
        <>
          <Paper elevation={2} variant="outlined" className={classes.root}>
            <List dense className={classes.list}>
              {Object.values(projects).map(({ name, id }, idx, arr) => (
                <>
                  <Link component={RouterLink} to={`/app/projects/${id}`}>
                    <ListItem button key={id}>
                      <ListItemText primary={name} />
                    </ListItem>
                  </Link>
                  {idx !== arr.length - 1 && <Divider />}
                </>
              ))}
            </List>
          </Paper>
          <CreateProject projects={projects} />
        </>
      ) : (
        <>
          <Typography color="textSecondary" className={classes.infoText}>
            Project list is empty
          </Typography>
          <CreateProject first projects={projects} />
        </>
      )}
    </>
  );
};

ProjectsList.defaultProps = {
  projects: [],
};

ProjectsList.propTypes = {
  projects: PropTypes.arrayOf(propTypes.project),
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ projects, ui: { loading } }) => ({
  projects,
  loading,
});

export default connect(mapStateToProps)(ProjectsList);