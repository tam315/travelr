import postsReducer from '../postsReducer';
import types from '../../actions/types';

const INITIAL_STATE = {
  all: [],
  allFilter: {},
  mine: [],
  mineSelected: [],
  currentPost: {},
};

describe('posts reducer', () => {
  test('returns correct state', () => {
    const DUMMY_POSTS = ['dummy1', 'dummy2'];
    const expected = {
      ...INITIAL_STATE,
      all: ['dummy1', 'dummy2'],
    };

    const action = {
      type: types.FETCH_ALL_POSTS_SUCCESS,
      payload: DUMMY_POSTS,
    };

    expect(postsReducer(undefined, action)).toEqual(expected);
  });
});
