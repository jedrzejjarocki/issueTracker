import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Divider, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, makeStyles,
} from '@material-ui/core';
import ListOutlinedIcon from '@material-ui/icons/ListOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import RouterLink from '../commons/RouterLink';
import { RootState } from '../../redux/rootReducer';
import { getCurrentProject } from '../../redux/ui/selectors';

const drawerWidth = 210;

interface Props extends ReduxProps {
  mobileOpen: boolean
  handleDrawerToggle: () => void
}

const NavDrawer: React.FC<Props> = ({
  mobileOpen, handleDrawerToggle, currentProjectId,
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
    to: `/app/projects/${currentProjectId}/activeSprint`,
    icon: <TableChartOutlinedIcon />,
    text: 'Active sprint',
  }, {
    to: `/app/projects/${currentProjectId}/reports`,
    icon: <AssessmentOutlinedIcon />,
    text: 'Reports',
  }];

  const DrawerContent = ({ toggleOnLinkClick }: { toggleOnLinkClick?: boolean }) => (
    <>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {listItems.map(({ to, icon, text }) => (
          <RouterLink key={to} to={to} onClick={toggleOnLinkClick ? handleDrawerToggle : null}>
            <ListItem button className={classes.listItem}>
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          </RouterLink>
        ))}
      </List>
    </>
  );

  return (
    <>
      {currentProjectId && (
      <nav className={classes.drawer}>
        <Hidden mdDown implementation="css">
          <Drawer
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
            <DrawerContent toggleOnLinkClick />
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            variant="permanent"
            open
          >
            <DrawerContent />
          </Drawer>
        </Hidden>
      </nav>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentProjectId: getCurrentProject(state)?.id,
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(NavDrawer);
