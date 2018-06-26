import types from './types';
import config from '../config';

const actions = {};

actions.fetchAllPosts = (criterion = {}) => async dispatch => {
  const {
    userId,
    displayName,
    description,
    minDate,
    maxDate,
    lng,
    lat,
    radius,
    minViewCount,
    maxViewCount,
    minLikedCount,
    maxLikedCount,
    minCommentsCount,
    maxCommentsCount,
    limit,
  } = criterion;

  const params = [];

  if (userId) params.push(`user_id=${userId}`);
  if (displayName) params.push(`display_name=${displayName}`);
  if (description) params.push(`description=${description}`);
  if (minDate) params.push(`min_date=${minDate}`);
  if (maxDate) params.push(`max_date=${maxDate}`);
  if (lng) params.push(`lng=${lng}`);
  if (lat) params.push(`lat=${lat}`);
  if (radius) params.push(`radius=${radius}`);
  if (minViewCount) params.push(`min_view_count=${minViewCount}`);
  if (maxViewCount) params.push(`max_view_count=${maxViewCount}`);
  if (minLikedCount) params.push(`min_liked_count=${minLikedCount}`);
  if (maxLikedCount) params.push(`max_liked_count=${maxLikedCount}`);
  if (minCommentsCount) params.push(`min_comments_count=${minCommentsCount}`);
  if (maxCommentsCount) params.push(`max_comments_count=${maxCommentsCount}`);
  if (limit) params.push(`limit=${limit}`);

  let queryParams = '';
  if (params.length) queryParams = `?${params.join('&')}`;

  try {
    const response = await fetch(`${config.apiUrl}posts${queryParams}`);
    const posts = await response.json();
    dispatch({
      type: types.FETCH_ALL_POSTS_SUCCESS,
      payload: posts,
    });
  } catch (err) {
    dispatch({
      type: types.FETCH_ALL_POSTS_FAIL,
    });
  }
};

actions.fetchUserInfo = token => async dispatch => {
  try {
    const response = await fetch(`${config.apiUrl}users/token`, {
      headers: {
        authorization: token,
      },
    });

    if (!response.ok) {
      dispatch({
        type: types.FETCH_USER_INFO_FAIL, // TODO: toast
      });
      return;
    }

    const userInfo = await response.json();
    dispatch({
      type: types.FETCH_USER_INFO_SUCCESS,
      payload: { ...userInfo, token },
    });
  } catch (err) {
    dispatch({
      type: types.FETCH_USER_INFO_FAIL, // TODO: toast
    });
  }
};

actions.updateUserInfo = (user, newUserInfo) => async dispatch => {
  const { userId, token } = user;
  const { displayName } = newUserInfo;
  try {
    const response = await fetch(`${config.apiUrl}users/${userId}`, {
      method: 'PUT',
      headers: {
        authorization: token,
      },
      body: JSON.stringify({ displayName }),
    });

    if (!response.ok) {
      dispatch({
        type: types.UPDATE_USER_INFO_FAIL, // TODO: toast
      });
      return;
    }

    dispatch({
      type: types.UPDATE_USER_INFO_SUCCESS, // TODO: toast
      payload: { displayName },
    });
  } catch (err) {
    dispatch({
      type: types.UPDATE_USER_INFO_FAIL, // TODO: toast
    });
  }
};

actions.deleteUser = (user, callback) => async dispatch => {
  const { userId, token } = user;
  try {
    const response = await fetch(`${config.apiUrl}users/${userId}`, {
      method: 'DELETE',
      headers: {
        authorization: token,
      },
    });

    if (!response.ok) {
      dispatch({
        type: types.DELETE_USER_FAIL, // TODO: toast
      });
      return;
    }

    dispatch({
      type: types.DELETE_USER_SUCCESS, // TODO: toast
    });
    callback();
  } catch (err) {
    dispatch({
      type: types.DELETE_USER_FAIL, // TODO: toast
    });
  }
};

export default actions;
