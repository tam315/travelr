const INITIAL_STATE = {
  userId: 'dummy_user_id', // TODO: replace
  token: 'dummy_token', // TODO: replace
  displayName: null,
  isAdmin: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
