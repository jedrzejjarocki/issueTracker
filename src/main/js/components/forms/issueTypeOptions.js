import {ListItemIcon, Typography} from "@material-ui/core";
import React from "react";
import issueTypes from "../../constants/issueTypes";

export default Object.entries(issueTypes).map(([name, icon]) => ({
  value: name,
  label: (
    <Typography>
      <ListItemIcon>{icon}</ListItemIcon>
      {name}
    </Typography>
  ),
}));
