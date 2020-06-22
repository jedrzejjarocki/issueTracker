import React from "react";
import {makeStyles, Typography} from "@material-ui/core";
import {useLocation} from "react-router-dom";
import LogInForm from "./forms/LoginForm";
import RegisterForm from "./forms/RegisterForm";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "white",
    "&:after": {
      position: "absolute",
      content: "''",
      left: 0,
      bottom: 0,
      width: "inherit",
      height: "72vh",
      backgroundColor: theme.palette.primary.main,
    },
  },
  header: {
    position: "absolute",
    left: theme.spacing(4),
    zIndex: 100,
    bottom: "72vh",
    "& > p": {
      color: "white",
    },
  },
  actionButtonContainer: {
    position: "absolute",
    right: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(2),
    },
  },
}));

const Index = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <Typography variant="h1" component="h1" color="primary">
          ISSUE TRACKER
        </Typography>
      </header>
      <div className={classes.actionButtonContainer}>
        <LogInForm isOpen={pathname === "/login"} />
        <RegisterForm isOpen={pathname === "/register"} />
      </div>
    </div>
  );
};

export default Index;
