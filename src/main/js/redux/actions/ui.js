export const SET_LOADING = 'SET_LOADING';
export const SET_MESSAGE = 'SET_MESSAGE';
export const SET_CURRENT_PROJECT = 'SET_CURRENT_PROJECT';

export const setMessage = (content, severity) => ({
  type: SET_MESSAGE,
  payload: {
    content,
    severity,
  },
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setCurrentProject = (id, userRole) => ({
  type: SET_CURRENT_PROJECT,
  payload: {
    id, userRole,
  },
});
