import React from "react";
import PropTypes from "prop-types";
import {Button} from "@material-ui/core";

const SubmitButton = ({ errors = {}, text = "Submit", ...rest }) => {
  const hasErrors = (err) => Object.values(err).some((error) => !!error);
  return (
    <Button
      type="submit"
      color="primary"
      variant="contained"
      disabled={hasErrors(errors)}
      {...rest}
    >
      {text}
    </Button>
  );
};

SubmitButton.defaultProps = {
  text: "Submit",
};

SubmitButton.propTypes = {
  errors: PropTypes.objectOf(PropTypes.string).isRequired,
  text: PropTypes.string,
};

export default SubmitButton;
