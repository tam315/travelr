import types from '../../actions/types';
import {
  DUMMY_POSTS,
  DUMMY_POSTS_IDS,
  DUMMY_USER_STORE,
} from '../../config/dummies';
import postsReducer, { INITIAL_STATE } from '../postsReducer';

describe('posts reducer', () => {
  test('FETCH_ALL_POSTS_SUCCESS', () => {
    const action = {
      type: types.FETCH_ALL_POSTS_SUCCESS,
      payload: DUMMY_POSTS,
    };

    const expected = {
      ...INITIAL_STATE,
      all: DUMMY_POSTS,
    };

    expect(postsReducer(INITIAL_STATE, action)).toEqual(expected);
  });

  test('FETCH_POST', () => {
    const stateHavingCurrentPost = {
      ...INITIAL_STATE,
      currentPost: DUMMY_POSTS[0],
    };

    let action = {
      type: types.FETCH_POST,
      payload: { postId: DUMMY_POSTS[0].postId, user: DUMMY_USER_STORE },
    };

    // do nothing if the post to fetch is the same with the current post
    expect(postsReducer(stateHavingCurrentPost, action)).toEqual(
      stateHavingCurrentPost,
    );

    action = {
      type: types.FETCH_POST,
      payload: { postId: 99, user: DUMMY_USER_STORE },
    };

    const expected = {
      ...INITIAL_STATE,
      currentPost: null,
    };

    // reset current post if the post to fetch is the different with the current post
    expect(postsReducer(stateHavingCurrentPost, action)).toEqual(expected);
  });

  test('FETCH_POST_SUCCESS', () => {
    const action = {
      type: types.FETCH_POST_SUCCESS,
      payload: DUMMY_POSTS[0],
    };

    const expected = {
      ...INITIAL_STATE,
      currentPost: DUMMY_POSTS[0],
    };

    expect(postsReducer(INITIAL_STATE, action)).toEqual(expected);
  });

  test('FETCH_MY_POSTS_SUCCESS', () => {
    const action = {
      type: types.FETCH_MY_POSTS_SUCCESS,
      payload: DUMMY_POSTS,
    };

    const expected = {
      ...INITIAL_STATE,
      myPosts: DUMMY_POSTS,
    };

    expect(postsReducer(INITIAL_STATE, action)).toEqual(expected);
  });

  test('DELETE_POSTS_SUCCESS', () => {
    const action = {
      type: types.DELETE_POSTS_SUCCESS,
    };

    const expected = {
      ...INITIAL_STATE,
      myPostsSelected: [],
    };

    expect(postsReducer(INITIAL_STATE, action)).toEqual(expected);
  });

  test('INCREASE_LIMIT_COUNT_OF_GRID', () => {
    const action = {
      type: types.INCREASE_LIMIT_COUNT_OF_GRID,
    };

    const expected = {
      ...INITIAL_STATE,
      limitCountOfGrid: 42,
    };

    expect(postsReducer(INITIAL_STATE, action)).toEqual(expected);
  });

  test('SELECT_MY_POSTS', () => {
    let action = {
      type: types.SELECT_MY_POSTS,
      payload: [1, 2, 3, 4, 5],
    };

    let expected = {
      ...INITIAL_STATE,
      myPostsSelected: [1, 2, 3, 4, 5],
    };

    const currentState = postsReducer(INITIAL_STATE, action);

    expect(currentState).toEqual(expected);

    action = {
      type: types.SELECT_MY_POSTS,
      payload: [1, 3, 5],
    };

    expected = {
      ...INITIAL_STATE,
      myPostsSelected: [2, 4],
    };

    expect(postsReducer(currentState, action)).toEqual(expected);
  });

  test('SELECT_MY_POSTS_ALL', () => {
    const state = {
      ...INITIAL_STATE,
      myPosts: DUMMY_POSTS,
    };

    const action = {
      type: types.SELECT_MY_POSTS_ALL,
    };

    const expected = {
      ...state,
      myPostsSelected: DUMMY_POSTS_IDS,
    };

    expect(postsReducer(state, action)).toEqual(expected);
  });

  test('SELECT_MY_POSTS_RESET', () => {
    const state = {
      ...INITIAL_STATE,
      myPostsSelected: [1, 2, 3, 4, 5],
    };

    const action = {
      type: types.SELECT_MY_POSTS_RESET,
    };

    const expected = {
      ...state,
      myPostsSelected: [],
    };

    expect(postsReducer(state, action)).toEqual(expected);
  });
});
