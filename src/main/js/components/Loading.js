import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = () => {
  const { root } = makeStyles(() => ({
    root: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
  }))();
  return (
    <div className={root}>
      <CircularProgress />;
    </div>
  );
};

export default Loading;
