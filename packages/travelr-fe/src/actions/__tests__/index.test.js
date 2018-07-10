// @flow
import {
  DUMMY_COMMENTS,
  DUMMY_FILTER_CRITERION,
  DUMMY_NEW_POST,
  DUMMY_POSTS,
  DUMMY_POSTS_IDS,
  DUMMY_POST_TO_EDIT,
  DUMMY_USER_STORE,
  DUMMY_USER_STORE_UNAUTHORIZED,
} from '../../config/dummies';
import firebaseUtils from '../../utils/firebaseUtils';
import history from '../../utils/history';
import actions from '../index';
import types from '../types';

jest.mock('../../utils/firebaseUtils');
jest.mock('../../utils/history');

beforeEach(() => {
  fetch.resetMocks();
});

describe('getOrCreateUserInfo', () => {
  let mock;
  let thunk;
  const DUMMY_TOKEN = DUMMY_USER_STORE.token;
  const DUMMY_DISPLAY_NAME = 'DUMMY_DISPLAY_NAME';

  beforeEach(() => {
    mock = {
      dispatch: jest.fn(),
    };
    thunk = actions.getOrCreateUserInfo({
      token: DUMMY_TOKEN,
      displayName: DUMMY_DISPLAY_NAME,
    });
  });

  test('generates correct url', async () => {
    await thunk(mock.dispatch);

    const fetchUrl = fetch.mock.calls[0][0];
    const fetchOption = fetch.mock.calls[0][1];
    const body = JSON.parse(fetchOption.body);

    expect(fetchUrl).toContain('/users');
    expect(fetchOption.method).toContain('POST');
    expect(body).toEqual({ displayName: DUMMY_DISPLAY_NAME });
  });

  test('makes correct action when success', async () => {
    fetch.mockResponse(JSON.stringify(DUMMY_USER_STORE));
    history.location.pathname = '/auth';
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[0][0]).toEqual({
      type: types.GET_OR_CREATE_USER_INFO_SUCCESS,
      payload: DUMMY_USER_STORE,
    });

    // redirect if user intended sign in/up
    expect(history.push).toBeCalledWith('/all-map');
  });

  test('makes correct action when fail', async () => {
    fetch.mockReject();
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[0][0]).toEqual({
      type: types.GET_OR_CREATE_USER_INFO_FAIL,
    });
  });
});

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

    const thunk = actions.updateUserInfo(DUMMY_USER_STORE, DUMMY_NEW_USER_INFO);
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

    const thunk = actions.updateUserInfo(DUMMY_USER_STORE, DUMMY_NEW_USER_INFO);
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

    const mockDispatch = jest.fn();
    const thunk = actions.deleteUser(DUMMY_USER_STORE);
    await thunk(mockDispatch);

    const fetchUrl = fetch.mock.calls[0][0];
    const fetchOptions = fetch.mock.calls[0][1];

    // make a correct fetch
    expect(fetchUrl).toContain(`/users/${DUMMY_USER_STORE.userId}`);
    expect(fetchOptions.headers.authorization).toBe(DUMMY_USER_STORE.token);
    expect(fetchOptions.method).toBe('DELETE');

    expect(firebaseUtils.deleteUser).toBeCalled();

    // make a correct action
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.DELETE_USER_SUCCESS,
    });

    // navigate to the top page
    expect(history.push).toBeCalledWith('/');
  });

  test('make a correct action if fail', async () => {
    fetch.mockReject();

    const mockDispatch = jest.fn();
    const thunk = actions.deleteUser(DUMMY_USER_STORE);
    await thunk(mockDispatch);

    // make a correct action
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.DELETE_USER_FAIL,
    });
  });
});

describe('signOutUser', () => {
  test('invoke firebaseUtils', async () => {
    const mockDispatch = jest.fn();
    const thunk = actions.signOutUser();
    await thunk(mockDispatch);

    expect(firebaseUtils.signOutUser).toBeCalled();
  });

  test('make a correct action if success', async () => {
    const mockDispatch = jest.fn();
    const thunk = actions.signOutUser();
    await thunk(mockDispatch);

    // make a correct action
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.SIGN_OUT_USER_SUCCESS,
    });

    expect(history.push).toBeCalledWith('/');
  });

  test('make a correct action if fail', async () => {
    firebaseUtils.signOutUser = jest.fn().mockRejectedValue();
    const mockDispatch = jest.fn();
    const thunk = actions.signOutUser();
    await thunk(mockDispatch);

    // make a correct action
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.SIGN_OUT_USER_FAIL,
    });
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

  test('generates correct url (if user is NOT authenticated)', async () => {
    const thunk = actions.fetchPost(
      DUMMY_POST_ID,
      DUMMY_USER_STORE_UNAUTHORIZED,
    );
    const mockDispatch = jest.fn();
    await thunk(mockDispatch);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain(`/posts/${DUMMY_POST_ID}`);
  });

  test('generates correct url (if user IS authenticated)', async () => {
    const thunk = actions.fetchPost(DUMMY_POST_ID, DUMMY_USER_STORE);
    const mockDispatch = jest.fn();
    await thunk(mockDispatch);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain(
      `/posts/${DUMMY_POST_ID}?user_id=${DUMMY_USER_STORE.userId}`,
    );
  });

  test('makes correct action when success', async () => {
    fetch.mockResponseOnce(JSON.stringify(DUMMY_POSTS[0]));
    const thunk = actions.fetchPost(DUMMY_POST_ID, DUMMY_USER_STORE);
    const mockDispatch = jest.fn();
    await thunk(mockDispatch);

    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.FETCH_POST_START,
      payload: DUMMY_POST_ID,
    });
    expect(mockDispatch.mock.calls[1][0]).toEqual({
      type: types.FETCH_POST_SUCCESS,
      payload: DUMMY_POSTS[0],
    });
  });

  test('makes correct action when fail', async () => {
    fetch.mockReject();
    const thunk = actions.fetchPost(DUMMY_POST_ID, DUMMY_USER_STORE);
    const mockDispatch = jest.fn();
    await thunk(mockDispatch);

    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.FETCH_POST_START,
      payload: DUMMY_POST_ID,
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
    thunk = actions.createPost(DUMMY_USER_STORE, DUMMY_NEW_POST);
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

    expect(history.push).toBeCalledWith(`/post/${mockNewPostId}`);
  });

  test('makes correct action when fail', async () => {
    fetch.mockReject();
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[0][0]).toEqual({
      type: types.CREATE_POST_FAIL,
    });
  });
});

describe('editPost', () => {
  let mock;
  let thunk;

  beforeEach(() => {
    mock = {
      callback: jest.fn(),
      dispatch: jest.fn(),
    };
    thunk = actions.editPost(DUMMY_USER_STORE, DUMMY_POST_TO_EDIT);
  });

  test('generates correct url and body', async () => {
    await thunk(mock.dispatch);

    const fetchUrl = fetch.mock.calls[0][0];
    const fetchOption = fetch.mock.calls[0][1];
    const fetchBody = JSON.parse(fetchOption.body);

    expect(fetchUrl).toContain(`/posts/${DUMMY_POST_TO_EDIT.postId}`);
    expect(fetchOption.method).toContain('PUT');
    expect(fetchBody).toEqual(DUMMY_POST_TO_EDIT);
  });

  test('makes correct action when success', async () => {
    fetch.mockResponse(JSON.stringify({ postId: DUMMY_POST_TO_EDIT.postId }));
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[0][0]).toEqual({
      type: types.EDIT_POST_SUCCESS,
    });

    expect(history.push).toBeCalledWith(`/post/${DUMMY_POST_TO_EDIT.postId}`);
  });

  test('makes correct action when fail', async () => {
    fetch.mockReject();
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[0][0]).toEqual({
      type: types.EDIT_POST_FAIL,
    });
  });
});

describe('deletePost', () => {
  test('generate a correct url', async () => {
    fetch.mockResponse();

    const mockDispatch = jest.fn();
    const thunk = actions.deletePost(DUMMY_USER_STORE, DUMMY_POSTS_IDS[0]);
    await thunk(mockDispatch);

    const fetchUrl = fetch.mock.calls[0][0];
    const fetchOptions = fetch.mock.calls[0][1];

    // make a correct fetch
    expect(fetchUrl).toContain(`/posts/${DUMMY_POSTS_IDS[0]}`);
    expect(fetchOptions.method).toBe('DELETE');
  });

  test('make a correct action if test succeed', async () => {
    fetch.mockResponse();
    const mockDispatch = jest.fn();
    const thunk = actions.deletePost(DUMMY_USER_STORE, DUMMY_POSTS_IDS[0]);
    await thunk(mockDispatch);

    // make a correct action
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.DELETE_POST_SUCCESS,
    });

    expect(history.push).toBeCalledWith('/account/posts');
  });

  test('make a correct action if test failed', async () => {
    fetch.mockReject();
    const mockDispatch = jest.fn();
    const thunk = actions.deletePost(DUMMY_USER_STORE, DUMMY_POSTS_IDS[0]);
    await thunk(mockDispatch);

    // make a correct action
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.DELETE_POST_FAIL,
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
      type: types.DELETE_POSTS_SUCCESS,
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
      type: types.DELETE_POSTS_FAIL,
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

  test('do nothing if userId is not provided', async () => {
    fetch.mockResponse();

    const mockDispatch = jest.fn();
    const thunk = actions.fetchMyPosts({ ...DUMMY_USER_STORE, userId: '' });
    await thunk(mockDispatch);

    expect(fetch).not.toBeCalled();
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
    actions.fetchPost = jest.fn();
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[0][0]).toEqual({
      type: types.CREATE_COMMENT_SUCCESS,
    });
    expect(actions.fetchPost).toBeCalled();
  });

  test('makes correct action when fail', async () => {
    fetch.mockReject();
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[0][0]).toEqual({
      type: types.CREATE_COMMENT_FAIL,
    });
  });
});

describe('deleteComment', () => {
  let mock;
  let thunk;
  const DUMMY_COMMENT = DUMMY_COMMENTS[0];

  beforeEach(() => {
    mock = {
      dispatch: jest.fn(),
    };
    thunk = actions.deleteComment(DUMMY_USER_STORE, DUMMY_COMMENT);
  });

  test('generates correct url and body', async () => {
    await thunk(mock.dispatch);

    const fetchUrl = fetch.mock.calls[0][0];
    const fetchOption = fetch.mock.calls[0][1];

    expect(fetchUrl).toContain(`/posts/comments/${DUMMY_COMMENT.commentId}`);
    expect(fetchOption.method).toContain('DELETE');
  });

  test('makes correct action when success', async () => {
    fetch.mockResponse();
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[0][0]).toEqual({
      type: types.DELETE_COMMENT_SUCCESS,
    });
  });

  test('makes correct action when fail', async () => {
    fetch.mockReject();
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[0][0]).toEqual({
      type: types.DELETE_COMMENT_FAIL,
    });
  });
});

describe('toggleLike', () => {
  let mock;
  let thunk;

  beforeEach(() => {
    mock = {
      dispatch: jest.fn(),
    };
    thunk = actions.toggleLike(DUMMY_USER_STORE, DUMMY_POSTS[0]);
  });

  test('generates correct url', async () => {
    await thunk(mock.dispatch);

    const fetchUrl = fetch.mock.calls[0][0];
    const fetchOption = fetch.mock.calls[0][1];

    expect(fetchUrl).toContain(`/posts/${DUMMY_POSTS[0].postId}/like/toggle`);
    expect(fetchOption.method).toContain('POST');
  });

  test('makes correct action when success', async () => {
    fetch.mockResponse();
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[0][0]).toEqual({
      type: types.TOGGLE_LIKE_SUCCESS,
    });
  });

  test('makes correct action when fail', async () => {
    fetch.mockReject();
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[0][0]).toEqual({
      type: types.TOGGLE_LIKE_FAIL,
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

describe('addSnackbarQueue', () => {
  test('make a correct action', () => {
    const action = actions.addSnackbarQueue('message1');
    expect(action).toEqual({
      type: types.ADD_SNACKBAR_QUEUE,
      payload: 'message1',
    });
  });
});

describe('startProgress', () => {
  test('make a correct action', () => {
    const action = actions.startProgress('signin');
    expect(action).toEqual({
      type: types.START_PROGRESS,
      payload: 'signin',
    });
  });
});

describe('finishProgress', () => {
  test('make a correct action', () => {
    const action = actions.finishProgress('signin');
    expect(action).toEqual({
      type: types.FINISH_PROGRESS,
      payload: 'signin',
    });
  });
});
