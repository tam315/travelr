import { combineReducers } from 'redux';
import app from './appReducer';
import posts from './postsReducer';
import user from './userReducer';

export default combineReducers({
  app,
  posts,
  user,
});
