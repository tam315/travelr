import { combineReducers } from 'redux';
import app from './appReducer';
import posts from './postsReducer';
import user from './userReducer';
import filter from './filterReducer';

export default combineReducers({
  app,
  posts,
  user,
  filter,
});
