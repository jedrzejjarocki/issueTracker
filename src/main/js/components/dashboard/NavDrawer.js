import React from "react";
import PropTypes from "prop-types";
import {Divider, Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, makeStyles,} from "@material-ui/core";
import InboxIcon from "@material-ui/icons/Menu";

const drawerWidth = 200;

const NavDrawer = ({ mobileOpen, handleDrawerToggle, window }) => {
  const classes = makeStyles((theme) => ({
    drawer: {
      [theme.breakpoints.up("md")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
  }))();

  const container =
    window !== undefined ? () => window().document.body : undefined;
  const drawerContent = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {["Backlog", "Active Sprints", "Reports"].map((text) => (
          <ListItem button key={text}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Hidden xlUp implementation="css">
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
  );
};

NavDrawer.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  window: PropTypes.object,
};

export default NavDrawer;
