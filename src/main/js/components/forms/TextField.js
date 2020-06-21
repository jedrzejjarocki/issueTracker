import React from "react";
import PropTypes from "prop-types";
import {TextField} from "@material-ui/core";
import * as propTypes from "../../propTypes";

const CustomTextField = ({
  name,
  value,
  error,
  handleChange,
  children,
  label,
  ...rest
}) => {
  const capitalize = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);
  return (
    <TextField
      name={name}
      label={label || capitalize(name)}
      value={value}
      variant="outlined"
      onChange={handleChange}
      error={!!error}
      helperText={error || ""}
      {...rest}
    >
      {children}
    </TextField>
  );
};

CustomTextField.defaultProps = {
  error: null,
  children: null,
  label: null,
};

CustomTextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  children: propTypes.children,
};

export default CustomTextField;
