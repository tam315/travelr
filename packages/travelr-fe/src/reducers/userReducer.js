import types from '../actions/types';

const INITIAL_STATE = {
  userId: null,
  token: null,
  displayName: null,
  isAdmin: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_USER_INFO_SUCCESS: {
      const { userId, token, displayName, isAdmin } = action.payload;

      return {
        userId,
        token,
        displayName,
        isAdmin,
      };
    }
    case types.UPDATE_USER_INFO_SUCCESS: {
      const { displayName } = action.payload;

      return {
        ...state,
        displayName,
      };
    }
    case types.DELETE_USER_SUCCESS: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};
