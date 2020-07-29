import React from 'react';
import IssueTypes from '../../../constants/issueTypes';

export default Object.entries(IssueTypes).map(([key, { value, icon }]) => ({
  value: key,
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
