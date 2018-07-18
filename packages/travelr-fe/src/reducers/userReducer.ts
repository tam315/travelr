import { UserStore } from '../config/types';
import actionTypes from '../actions/types';

export const INITIAL_STATE: UserStore = {
  userId: '',
  token: '',
  displayName: '',
  isAdmin: false,
  emailVerified: false,
  earnedLikes: 0,
  earnedComments: 0,
  earnedViews: 0,
};

export default (state: UserStore = INITIAL_STATE, action: any): UserStore => {
  switch (action.type) {
    case actionTypes.GET_OR_CREATE_USER_INFO_SUCCESS: {
      return { ...state, ...action.payload };
    }
    case actionTypes.UPDATE_USER_INFO_SUCCESS: {
      const { displayName } = action.payload;

      return { ...state, displayName };
    }
    case actionTypes.DELETE_USER_SUCCESS: {
      return INITIAL_STATE;
    }
    case actionTypes.SIGN_OUT_USER_SUCCESS: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};
