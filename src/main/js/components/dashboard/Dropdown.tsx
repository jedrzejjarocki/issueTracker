import React, {
  KeyboardEventHandler, MutableRefObject, useRef, useState,
} from 'react';
import {
  ClickAwayListener, Grow, MenuList, Paper, Popper,
} from '@material-ui/core';

interface Props {
  render: (ref: MutableRefObject<any>, ariaHasPopup: boolean, toggleOpen: () => void) => React.ReactNode
}

const Dropdown: React.FC<Props> = ({ children, render }) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen(!open);

  const handleClickAway = () => setOpen(false);

  const handleListKeyDown: KeyboardEventHandler = (e) => {
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
              <ClickAwayListener onClickAway={handleClickAway}>
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

export default Dropdown;
