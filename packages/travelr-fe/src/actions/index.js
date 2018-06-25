import types from './types';
import config from '../config';

const DUMMY_TOKEN = 'dummy_token';

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

actions.createPost = (post, successCallback) => async dispatch => {
  try {
    const response = await fetch(`${config.apiUrl}posts`, {
      method: 'POST',
      headers: {
        authorization: DUMMY_TOKEN, // TODO: replace token
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      dispatch({ type: types.CREATE_POST_FAIL }); // TODO: toast
    }

    const { postId } = await response.json();
    dispatch({ type: types.CREATE_POST_SUCCESS }); // TODO: toast
    successCallback(postId);
  } catch (err) {
    dispatch({ type: types.CREATE_POST_FAIL }); // TODO: toast
  }
};

export default actions;
