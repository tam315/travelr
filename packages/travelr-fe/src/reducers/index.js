import { combineReducers } from 'redux';
import user from './userReducer';
import posts from './postsReducer';

export default combineReducers({
  user,
  posts,
});
