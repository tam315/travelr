const INITIAL_STATE = {
  userId: null,
  token: localStorage.getItem('token'),
  displayName: null,
  isAdmin: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
