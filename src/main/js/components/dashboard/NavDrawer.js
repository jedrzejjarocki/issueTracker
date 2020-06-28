import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Divider, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, makeStyles,} from '@material-ui/core';
import ListOutlinedIcon from '@material-ui/icons/ListOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import RouterLink from '../commons/RouterLink';

const drawerWidth = 210;

const NavDrawer = ({
  mobileOpen, handleDrawerToggle, window, currentProjectId,
}) => {
  const classes = makeStyles((theme) => ({
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      zIndex: 0,
      width: drawerWidth,
    },
    listItem: {
      padding: theme.spacing(2, 3),
    },
  }))();

  const listItems = [{
    to: `/app/projects/${currentProjectId}/board`,
    icon: <ListOutlinedIcon />,
    text: 'Board',
  }, {
    to: `/app/projects/${currentProjectId}/team`,
    icon: <PeopleAltOutlinedIcon />,
    text: 'Team',
  }, {
    to: `/app/projects/${currentProjectId}/active`,
    icon: <TableChartOutlinedIcon />,
    text: 'Active sprint',
  }, {
    to: `/app/projects/${currentProjectId}/reports`,
    icon: <AssessmentOutlinedIcon />,
    text: 'Reports',
  }];

  const container = window !== undefined ? () => window().document.body : undefined;
  const drawerContent = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {listItems.map(({ to, icon, text }) => (
          <RouterLink to={to}>
            <ListItem button className={classes.listItem}>
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </RouterLink>
        ))}
      </List>
    </div>
  );

  return (
    <>
      {currentProjectId && (
      <nav className={classes.drawer}>
        <Hidden mdDown implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawerContent}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawerContent}
          </Drawer>
        </Hidden>
      </nav>
      )}
    </>
  );
};

NavDrawer.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  window: PropTypes.object,
  currentProjectId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  currentProjectId: state.ui.currentProject,
});

export default connect(mapStateToProps)(NavDrawer);
