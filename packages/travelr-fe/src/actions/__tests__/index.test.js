// @flow
import {
  DUMMY_FILTER_CRITERION,
  DUMMY_NEW_POST,
  DUMMY_POSTS_IDS,
  DUMMY_POSTS,
  DUMMY_USER_STORE,
} from '../../config/dummies';
import actions from '../index';
import types from '../types';

beforeEach(() => {
  fetch.resetMocks();
});

describe('actions', () => {
  describe('fetchUserInfo', () => {
    test('generates correct url', async () => {
      fetch.mockResponse();

      const thunk = actions.fetchUserInfo(DUMMY_USER_STORE);
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      const fetchUrl = fetch.mock.calls[0][0];
      const fetchOptions = fetch.mock.calls[0][1];
      expect(fetchUrl).toContain('/users/token');
      expect(fetchOptions.headers.authorization).toBe(DUMMY_USER_STORE.token);
    });

    test('makes correct action when success', async () => {
      const dummyResponse = DUMMY_USER_STORE;

      fetch.mockResponse(JSON.stringify(dummyResponse));

      const thunk = actions.fetchUserInfo(DUMMY_USER_STORE);
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.FETCH_USER_INFO_SUCCESS,
        payload: dummyResponse,
      });
    });

    test('makes correct action when fail', async () => {
      fetch.mockReject();

      const thunk = actions.fetchUserInfo(DUMMY_USER_STORE);
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.FETCH_USER_INFO_FAIL,
      });
    });
  });

  describe('updateUserInfo', () => {
    const DUMMY_NEW_USER_INFO = {
      displayName: 'dd',
    };

    test('make a correct fetch and action if success', async () => {
      fetch.mockResponse();

      const thunk = actions.updateUserInfo(
        DUMMY_USER_STORE,
        DUMMY_NEW_USER_INFO,
      );
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      const fetchUrl = fetch.mock.calls[0][0];
      const fetchOptions = fetch.mock.calls[0][1];

      // make a correct fetch
      expect(fetchUrl).toContain(`/users/${DUMMY_USER_STORE.userId}`);
      expect(fetchOptions.headers.authorization).toBe(DUMMY_USER_STORE.token);
      expect(fetchOptions.method).toBe('PUT');

      // make a correct action
      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.UPDATE_USER_INFO_SUCCESS,
        payload: DUMMY_NEW_USER_INFO,
      });
    });

    test('make a correct action if fail', async () => {
      fetch.mockReject();

      const thunk = actions.updateUserInfo(
        DUMMY_USER_STORE,
        DUMMY_NEW_USER_INFO,
      );
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      // make a correct action
      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.UPDATE_USER_INFO_FAIL,
      });
    });
  });

  describe('deleteUser', () => {
    test('make a correct fetch and action if success', async () => {
      fetch.mockResponse();

      const mockCallback = jest.fn();
      const mockDispatch = jest.fn();
      const thunk = actions.deleteUser(DUMMY_USER_STORE, mockCallback);
      await thunk(mockDispatch);

      const fetchUrl = fetch.mock.calls[0][0];
      const fetchOptions = fetch.mock.calls[0][1];

      // make a correct fetch
      expect(fetchUrl).toContain(`/users/${DUMMY_USER_STORE.userId}`);
      expect(fetchOptions.headers.authorization).toBe(DUMMY_USER_STORE.token);
      expect(fetchOptions.method).toBe('DELETE');

      // make a correct action
      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.DELETE_USER_SUCCESS,
      });

      // callback called
      expect(mockCallback).toBeCalled();
    });

    test('make a correct action if fail', async () => {
      fetch.mockReject();

      const mockCallback = jest.fn();
      const mockDispatch = jest.fn();
      const thunk = actions.deleteUser(DUMMY_USER_STORE, mockCallback);
      await thunk(mockDispatch);

      // make a correct action
      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.DELETE_USER_FAIL,
      });

      // callback shouldn't called
      expect(mockCallback).not.toBeCalled();
    });
  });

  describe('fetchAllPosts', () => {
    test('generates correct url', async () => {
      const criterion = DUMMY_FILTER_CRITERION;

      const thunk = actions.fetchAllPosts(criterion);
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      expect(fetch.mock.calls[0][0]).toContain(
        'posts?' +
          'user_id=dummy_userId' +
          '&display_name=dummy_displayName' +
          '&description=dummy_description' +
          '&min_date=1990-01-01' +
          '&max_date=1999-12-31' +
          '&lng=1' +
          '&lat=2' +
          '&radius=3' +
          '&min_view_count=4' +
          '&max_view_count=5' +
          '&min_liked_count=6' +
          '&max_liked_count=7' +
          '&min_comments_count=8' +
          '&max_comments_count=9' +
          '&limit=10',
      );
    });

    test('makes GET request', async () => {
      const thunk = actions.fetchAllPosts();
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      expect(fetch.mock.calls.length).toBe(1);
    });

    test('makes correct action when success', async () => {
      const DUMMY_RESPONSE = ['dummyPost1', 'dummyPost2'];

      fetch.mockResponseOnce(JSON.stringify(DUMMY_RESPONSE));
      const thunk = actions.fetchAllPosts();
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.FETCH_ALL_POSTS_SUCCESS,
        payload: DUMMY_RESPONSE,
      });
    });

    test('makes correct action when fail', async () => {
      fetch.mockReject(new Error('fake error message'));
      const thunk = actions.fetchAllPosts();
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.FETCH_ALL_POSTS_FAIL,
      });
    });
  });

  describe('fetchPost', () => {
    const DUMMY_POST_ID = 123;

    test('generates correct url', async () => {
      const thunk = actions.fetchPost(DUMMY_POST_ID);
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch.mock.calls[0][0]).toContain(`/posts/${DUMMY_POST_ID}`);
    });

    test('makes correct action when success', async () => {
      fetch.mockResponseOnce(JSON.stringify(DUMMY_POSTS[0]));
      const thunk = actions.fetchPost(DUMMY_POST_ID);
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.FETCH_POST_START,
      });
      expect(mockDispatch.mock.calls[1][0]).toEqual({
        type: types.FETCH_POST_SUCCESS,
        payload: DUMMY_POSTS[0],
      });
    });

    test('makes correct action when fail', async () => {
      fetch.mockReject();
      const thunk = actions.fetchPost(DUMMY_POST_ID);
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.FETCH_POST_START,
      });
      expect(mockDispatch.mock.calls[1][0]).toEqual({
        type: types.FETCH_POST_FAIL,
      });
    });
  });

  describe('createPost', () => {
    let mock;
    let thunk;

    beforeEach(() => {
      mock = {
        callback: jest.fn(),
        dispatch: jest.fn(),
      };
      thunk = actions.createPost(
        DUMMY_USER_STORE,
        DUMMY_NEW_POST,
        mock.callback,
      );
    });

    test('generates correct url and body', async () => {
      await thunk(mock.dispatch);

      const fetchUrl = fetch.mock.calls[0][0];
      const fetchOption = fetch.mock.calls[0][1];
      const fetchBody = JSON.parse(fetchOption.body);

      expect(fetchUrl).toContain('/posts');
      expect(fetchOption.method).toContain('POST');
      expect(fetchBody).toEqual(DUMMY_NEW_POST);
    });

    test('makes correct action when success', async () => {
      const mockNewPostId = 123;
      fetch.mockResponse(JSON.stringify({ postId: mockNewPostId }));
      await thunk(mock.dispatch);

      expect(mock.dispatch.mock.calls[0][0]).toEqual({
        type: types.CREATE_POST_SUCCESS,
        payload: mockNewPostId,
      });
    });

    test('callback is invoked when success', async () => {
      const mockNewPostId = 123;
      fetch.mockResponse(JSON.stringify({ postId: mockNewPostId }));
      await thunk(mock.dispatch);

      expect(mock.callback).toBeCalledWith(mockNewPostId);
    });

    test('makes correct action when fail', async () => {
      fetch.mockReject();
      await thunk(mock.dispatch);

      expect(mock.dispatch.mock.calls[0][0]).toEqual({
        type: types.CREATE_POST_FAIL,
      });
    });
  });

  describe('deletePosts', () => {
    test('generate a correct url', async () => {
      fetch.mockResponse();

      const mockDispatch = jest.fn();
      const thunk = actions.deletePosts(DUMMY_USER_STORE, DUMMY_POSTS_IDS);
      await thunk(mockDispatch);

      const fetchUrl = fetch.mock.calls[0][0];
      const fetchOptions = fetch.mock.calls[0][1];
      const body = JSON.parse(fetchOptions.body);

      // make a correct fetch
      expect(fetchUrl).toContain('/posts');
      expect(fetchOptions.method).toBe('DELETE');
      expect(body).toEqual(DUMMY_POSTS_IDS);
    });

    test('make a correct action if test succeed', async () => {
      fetch.mockResponse();

      const mockDispatch = jest.fn();
      const thunk = actions.deletePosts(DUMMY_USER_STORE, DUMMY_POSTS_IDS);
      await thunk(mockDispatch);

      // make a correct action
      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.DELETE_MY_POSTS_SUCCESS,
        payload: DUMMY_POSTS_IDS,
      });
    });

    test('make a correct action if test failed', async () => {
      fetch.mockReject();

      const mockDispatch = jest.fn();
      const thunk = actions.deletePosts(DUMMY_USER_STORE, DUMMY_POSTS_IDS);
      await thunk(mockDispatch);

      // make a correct action
      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.DELETE_MY_POSTS_FAIL,
      });
    });
  });

  describe('fetchMyPosts', () => {
    test('generate a correct url', async () => {
      fetch.mockResponse();

      const mockDispatch = jest.fn();
      const thunk = actions.fetchMyPosts(DUMMY_USER_STORE);
      await thunk(mockDispatch);

      const fetchUrl = fetch.mock.calls[0][0];

      // make a correct fetch
      expect(fetchUrl).toContain(`/posts?user_id=${DUMMY_USER_STORE.userId}`);
    });

    test('make a correct action if test succeed', async () => {
      fetch.mockResponse(JSON.stringify(DUMMY_POSTS));

      const mockDispatch = jest.fn();
      const thunk = actions.fetchMyPosts(DUMMY_USER_STORE);
      await thunk(mockDispatch);
      // make a correct action
      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.FETCH_MY_POSTS_SUCCESS,
        payload: DUMMY_POSTS,
      });
    });

    test('make a correct action if test failed', async () => {
      fetch.mockReject();

      const mockDispatch = jest.fn();
      const thunk = actions.fetchMyPosts(DUMMY_USER_STORE);
      await thunk(mockDispatch);

      // make a correct action
      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.FETCH_MY_POSTS_FAIL,
      });
    });
  });

  describe('selectMyPosts', () => {
    test('make a correct action if success', () => {
      const action = actions.selectMyPosts(DUMMY_POSTS_IDS);
      expect(action).toEqual({
        type: types.SELECT_MY_POSTS,
        payload: DUMMY_POSTS_IDS,
      });
    });
  });

  describe('selectMyPostsAll', () => {
    test('make a correct action if success', () => {
      const action = actions.selectMyPostsAll();
      expect(action).toEqual({
        type: types.SELECT_MY_POSTS_ALL,
      });
    });
  });

  describe('selectMyPostsReset', () => {
    test('make a correct action if success', () => {
      const action = actions.selectMyPostsReset();
      expect(action).toEqual({
        type: types.SELECT_MY_POSTS_RESET,
      });
    });
  });

  describe('createComment', () => {
    let mock;
    let thunk;
    const DUMMY_COMMENT = 'dummy_comment';
    const DUMMY_POST_ID = DUMMY_POSTS[0].postId;

    beforeEach(() => {
      mock = {
        dispatch: jest.fn(),
      };
      thunk = actions.createComment(
        DUMMY_USER_STORE,
        DUMMY_POST_ID,
        DUMMY_COMMENT,
      );
    });

    test('generates correct url and body', async () => {
      await thunk(mock.dispatch);

      const fetchUrl = fetch.mock.calls[0][0];
      const fetchOption = fetch.mock.calls[0][1];
      const fetchBody = JSON.parse(fetchOption.body);

      expect(fetchUrl).toContain(`/posts/${DUMMY_POST_ID}/comments`);
      expect(fetchOption.method).toContain('POST');
      expect(fetchBody).toEqual({ comment: DUMMY_COMMENT });
    });

    test('makes correct action when success', async () => {
      fetch.mockResponse();
      await thunk(mock.dispatch);

      expect(mock.dispatch.mock.calls[0][0]).toEqual({
        type: types.CREATE_COMMENT_SUCCESS,
      });
    });

    test('makes correct action when fail', async () => {
      fetch.mockReject();
      await thunk(mock.dispatch);

      expect(mock.dispatch.mock.calls[0][0]).toEqual({
        type: types.CREATE_COMMENT_FAIL,
      });
    });
  });

  describe('reduceSnackbarQueue', () => {
    test('make a correct action', () => {
      const action = actions.reduceSnackbarQueue();
      expect(action).toEqual({
        type: types.REDUCE_SNACKBAR_QUEUE,
      });
    });
  });
});
