import types from '../actions/types';

const INITIAL_STATE = {
  all: [],
  allFilter: {},
  mine: [],
  mineSelected: [],
  currentPost: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_ALL_POSTS_SUCCESS:
      return {
        ...state,
        all: action.payload,
      };
    default:
      return state;
  }
};
