import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {ClickAwayListener, Grow, MenuList, Paper, Popper,} from '@material-ui/core';
import * as propTypes from '../../propTypes';

const Dropdown = ({ children, render }) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleProjectToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleProjectsClose = (event) => {
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
    <div>
      {render(anchorRef, true, handleProjectToggle)}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleProjectsClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  {children}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

Dropdown.propTypes = {
  children: propTypes.children.isRequired,
  render: PropTypes.func.isRequired,
};

export default Dropdown;
