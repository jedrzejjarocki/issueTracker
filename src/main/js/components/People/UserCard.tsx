import React, {useState} from "react";
import {Card, CardActions, CardContent, Collapse, Grid, IconButton, makeStyles, Typography} from "@material-ui/core";
import UserAvatar from "../commons/UserAvatar";
import AddTeamMember from "./AddTeamMember";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {UserWithProjects} from "../../redux/selectors/project";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 180,
    minHeight: 230,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

interface Props {
  userWithProjects: UserWithProjects
  currentUserId: number
}

const UserCard: React.FC<Props> = ({userWithProjects, currentUserId}) => {
  const {userId, projects, username} = userWithProjects;

  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Grid item key={userId}>
      <Card variant="outlined" className={classes.root}>
        <CardContent>
          <Grid container direction="column" alignItems="center" justify="space-between">
            <UserAvatar name={username} isCurrentUser={userId === currentUserId} size="large"/>
            <Typography style={{paddingTop: '12px'}} variant="h5">{username}</Typography>
          </Grid>
        </CardContent>
        <CardActions disableSpacing>
          <AddTeamMember userWithProjects={userWithProjects} />
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon/>
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid container direction="column" justify="center" alignItems="center">
              <Typography>PROJECTS</Typography>
              {projects.map(({id, projectName, userRole}) => (
                <Typography key={id} variant="overline">
                  {`${projectName} \u2022 ${userRole}`}
                </Typography>
              ))}
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};

export default UserCard;