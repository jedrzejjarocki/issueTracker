import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {ClickAwayListener, Grow, MenuList, Paper, Popper,} from '@material-ui/core';
import * as propTypes from '../../propTypes';

const Dropdown = ({ children, render }) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleListKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <span style={{ zIndex: 100000 }}>
      {render(anchorRef, true, toggleOpen)}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  onKeyDown={handleListKeyDown}
                >
                  {children}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </span>
  );
};

Dropdown.propTypes = {
  children: propTypes.children.isRequired,
  render: PropTypes.func.isRequired,
};

export default Dropdown;
