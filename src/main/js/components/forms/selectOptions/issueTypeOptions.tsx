import React from 'react';
import IssueTypes from '../../../constants/issueTypes';

export default Object.values(IssueTypes).map(({ value, icon }) => ({
  value,
  label: (
    <div style={{
      display: 'flex',
      alignItems: 'center',
    }}
    >
      {icon}
      {'  '}
      {value}
    </div>
  ),
}));
