import {Button} from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";

const DefaultActionButton = ({ text, ...rest }) => (
  <Button variant="outlined" color="primary" {...rest}>
    {text}
  </Button>
);

DefaultActionButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default DefaultActionButton;
