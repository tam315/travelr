// @flow
import { combineReducers } from 'redux';
import user from './userReducer';
import posts from './postsReducer';
import app from './appReducer';

export default combineReducers({
  app,
  posts,
  user,
});
