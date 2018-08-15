import ApolloClient from 'apollo-boost';
import actions from '..';
import {
  DUMMY_COMMENTS,
  DUMMY_NEW_POST,
  DUMMY_POSTS,
  DUMMY_POSTS_IDS,
  DUMMY_POST_TO_EDIT,
  DUMMY_USER_STORE,
} from '../../config/dummies';
// @ts-ignore
import firebaseUtils from '../../utils/firebaseUtils';
import types from '../types';

jest.mock('apollo-boost');
jest.mock('../../utils/firebaseUtils');
jest.mock('../../utils/history');
jest.mock('../../utils/mapsUtils');

declare const fetch: any;

beforeEach(() => {
  fetch.resetMocks();
  jest.resetAllMocks();
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
  const thunk = actions.deleteUser(DUMMY_USER_STORE);
  // @ts-ignore
  firebaseUtils.authRef.currentUser = {
    delete: jest.fn(),
  };

  test('notify user to re-authenticate', async () => {
    fetch.mockResponse();
    firebaseUtils.canUserDeletedNow = jest.fn().mockResolvedValue(false);
    const mockDispatch = jest.fn();
    await thunk(mockDispatch);

    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.ADD_SNACKBAR_QUEUE,
      payload:
        'アカウントを削除するには再認証が必要です。一度サインアウトしてから、もう一度サインインしたあとに、同じ操作を行ってください。',
    });
    expect(fetch).not.toBeCalled();
  });

  test('make a correct fetch and action if success', async () => {
    fetch.mockResponse();
    firebaseUtils.canUserDeletedNow = jest.fn().mockResolvedValue(true);
    const mockDispatch = jest.fn();
    await thunk(mockDispatch);

    const fetchUrl = fetch.mock.calls[0][0];
    const fetchOptions = fetch.mock.calls[0][1];

    // make a correct fetch
    expect(fetchUrl).toContain(`/users/${DUMMY_USER_STORE.userId}`);
    expect(fetchOptions.headers.authorization).toBe(DUMMY_USER_STORE.token);
    expect(fetchOptions.method).toBe('DELETE');

    expect(firebaseUtils.authRef.currentUser.delete).toBeCalled();

    // make a correct action
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.DELETE_USER_SUCCESS,
    });
  });

  test('make a correct action if fail', async () => {
    fetch.mockReject();
    firebaseUtils.canUserDeletedNow = jest.fn().mockResolvedValue(true);
    const mockDispatch = jest.fn();
    await thunk(mockDispatch);

    // make a correct action
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.DELETE_USER_FAIL,
    });
  });
});

describe('signInWithEmail', () => {
  const mock = {
    dispatch: jest.fn(),
  };
  const thunk = actions.signInWithEmail('email', 'password');

  test('make a correct action if success', async () => {
    firebaseUtils.authRef.signInWithEmailAndPassword = jest.fn();
    // @ts-ignore
    firebaseUtils.authRef.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('dummy_token'),
      emailVerified: false,
    };
    await thunk(mock.dispatch);

    expect(firebaseUtils.authRef.signInWithEmailAndPassword).toBeCalled();
    expect(firebaseUtils.authRef.currentUser.getIdToken).toBeCalled();
    expect(mock.dispatch).toHaveBeenCalledWith({
      type: types.SIGN_IN_WITH_EMAIL,
    });
    expect(mock.dispatch).toHaveBeenCalledWith({
      type: types.SIGN_IN_WITH_EMAIL_SUCCESS,
      payload: {
        displayName: 'newuser',
        emailVerified: false,
        token: 'dummy_token',
      },
    });
  });

  test('notify user the error if signin failed', async () => {
    fetch.mockResponse();
    firebaseUtils.authRef.signInWithEmailAndPassword = jest
      .fn()
      .mockRejectedValue({});
    firebaseUtils.authRef.currentUser.getIdToken = jest
      .fn()
      .mockResolvedValue({});

    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[1][0].type).toBe(
      types.SIGN_IN_WITH_EMAIL_FAIL,
    );
    expect(typeof mock.dispatch.mock.calls[1][0].payload).toBe('object');
  });
});

describe('signUpWithEmail', () => {
  const mock = {
    dispatch: jest.fn(),
  };
  const thunk = actions.signUpWithEmail('email', 'password', 'displayName');

  test('get user info if signup succeed', async () => {
    firebaseUtils.authRef.createUserWithEmailAndPassword = jest.fn(() => ({
      user: {
        sendEmailVerification: jest.fn(),
      },
    }));
    // @ts-ignore
    firebaseUtils.authRef.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('dummy_token'),
      emailVerified: false,
    };
    await thunk(mock.dispatch);

    expect(firebaseUtils.authRef.createUserWithEmailAndPassword).toBeCalled();
    expect(firebaseUtils.authRef.currentUser.getIdToken).toBeCalled();
    expect(mock.dispatch).toHaveBeenCalledWith({
      type: types.SIGN_UP_WITH_EMAIL,
    });
    expect(mock.dispatch).toBeCalledWith({
      type: types.SIGN_UP_WITH_EMAIL_SUCCESS,
      payload: {
        displayName: 'displayName',
        emailVerified: false,
        token: 'dummy_token',
      },
    });
  });

  test('notify user the error if signup failed', async () => {
    firebaseUtils.authRef.createUserWithEmailAndPassword = jest
      .fn()
      .mockRejectedValue({});

    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[1][0].type).toBe(
      types.SIGN_UP_WITH_EMAIL_FAIL,
    );
    expect(typeof mock.dispatch.mock.calls[1][0].payload).toBe('object');
  });
});

describe('sendEmailVerification', () => {
  const mock = {
    dispatch: jest.fn(),
  };
  const thunk = actions.sendEmailVerification();

  test('success case', async () => {
    // @ts-ignore
    firebaseUtils.authRef.currentUser = { sendEmailVerification: jest.fn() };
    await thunk(mock.dispatch);

    expect(mock.dispatch).toBeCalledWith({
      type: types.SEND_EMAIL_VERIFICATION,
    });
    expect(
      firebaseUtils.authRef.currentUser.sendEmailVerification,
    ).toBeCalled();
    expect(mock.dispatch).toBeCalledWith({
      type: types.SEND_EMAIL_VERIFICATION_SUCCESS,
    });
  });

  test('failure case', async () => {
    // @ts-ignore
    firebaseUtils.authRef.currentUser = {
      sendEmailVerification: jest.fn().mockRejectedValue({}),
    };
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[1][0].type).toBe(
      types.SEND_EMAIL_VERIFICATION_FAIL,
    );
    expect(typeof mock.dispatch.mock.calls[1][0].payload).toBe('object');
  });
});

describe('sendPasswordResetEmail', () => {
  const mock = {
    dispatch: jest.fn(),
  };
  const thunk = actions.sendPasswordResetEmail('email');

  test('success case', async () => {
    firebaseUtils.authRef.sendPasswordResetEmail = jest.fn();
    await thunk(mock.dispatch);

    expect(mock.dispatch).toBeCalledWith({
      type: types.SEND_PASSWORD_RESET_EMAIL,
    });
    expect(firebaseUtils.authRef.sendPasswordResetEmail).toBeCalled();
    expect(mock.dispatch).toBeCalledWith({
      type: types.SEND_PASSWORD_RESET_EMAIL_SUCCESS,
    });
  });

  test('failure case', async () => {
    firebaseUtils.authRef.sendPasswordResetEmail = jest
      .fn()
      .mockRejectedValue({});
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[1][0].type).toBe(
      types.SEND_PASSWORD_RESET_EMAIL_FAIL,
    );
    expect(typeof mock.dispatch.mock.calls[1][0].payload).toBe('object');
  });
});

describe('signOutUser', () => {
  const thunk = actions.signOutUser();

  test('invoke firebaseUtils', async () => {
    const mockDispatch = jest.fn();
    await thunk(mockDispatch);

    expect(firebaseUtils.authRef.signOut).toBeCalled();
  });

  test('make a correct action if success', async () => {
    firebaseUtils.authRef.signOut = jest.fn();
    const mockDispatch = jest.fn();
    await thunk(mockDispatch);

    // make a correct action
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.SIGN_OUT_USER_SUCCESS,
    });
  });

  test('make a correct action if fail', async () => {
    firebaseUtils.authRef.signOut = jest.fn().mockRejectedValue({});

    const mockDispatch = jest.fn();
    await thunk(mockDispatch);

    // make a correct action
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.SIGN_OUT_USER_FAIL,
    });
  });
});

describe('fetchAllPosts', () => {
  test('makes correct action', () => {
    const action = actions.fetchAllPosts();
    expect(action).toEqual({
      type: types.FETCH_ALL_POSTS,
    });
  });
});

describe('fetchPost', () => {
  test('make correct action', () => {
    const DUMMY_POST_ID = 123;
    const action = actions.fetchPost(DUMMY_POST_ID);

    expect(action).toEqual({
      type: types.FETCH_POST,
      payload: DUMMY_POST_ID,
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
    const mockNewPostId = 123;
    fetch.mockResponse(JSON.stringify({ postId: mockNewPostId }));
    await thunk(mock.dispatch);

    const fetchUrl = fetch.mock.calls[0][0];
    const fetchOption = fetch.mock.calls[0][1];
    const fetchBody = JSON.parse(fetchOption.body);

    expect(fetchUrl).toContain('/posts');
    expect(fetchOption.method).toContain('POST');
    expect(Object.keys(fetchBody).length).toBe(6);
  });

  test('makes correct action when success', async () => {
    const mockNewPostId = 123;
    fetch.mockResponse(JSON.stringify({ postId: mockNewPostId }));
    firebaseUtils.uploadImageFile = jest.fn();
    await thunk(mock.dispatch);

    expect(mock.dispatch).toBeCalledWith({
      type: types.CREATE_POST,
    });
    expect(firebaseUtils.uploadImageFile).toHaveBeenCalledTimes(2);
    expect(mock.dispatch.mock.calls[1][0]).toEqual({
      type: types.CREATE_POST_SUCCESS,
      payload: mockNewPostId,
    });
  });

  test('makes correct action when fail', async () => {
    fetch.mockReject();
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[1][0].type).toBe(types.CREATE_POST_FAIL);
    expect(typeof mock.dispatch.mock.calls[1][0].payload).toBe('object');
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
    fetch.mockResponse(JSON.stringify({ postId: DUMMY_POST_TO_EDIT.postId }));
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

    expect(mock.dispatch).toBeCalledWith({
      type: types.EDIT_POST,
    });
    expect(mock.dispatch).toBeCalledWith({
      type: types.EDIT_POST_SUCCESS,
      payload: DUMMY_POST_TO_EDIT.postId,
    });
  });

  test('makes correct action when fail', async () => {
    fetch.mockReject();
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[1][0].type).toBe(types.EDIT_POST_FAIL);
    expect(typeof mock.dispatch.mock.calls[1][0].payload).toBe('object');
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
  });

  test('make a correct action if test failed', async () => {
    fetch.mockReject();
    const mockDispatch = jest.fn();
    const thunk = actions.deletePost(DUMMY_USER_STORE, DUMMY_POSTS_IDS[0]);
    await thunk(mockDispatch);

    // make a correct action
    expect(mockDispatch.mock.calls[0][0].type).toBe(types.DELETE_POST_FAIL);
    expect(typeof mockDispatch.mock.calls[0][0].payload).toBe('object');
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
  test('generate a correct query variables and action', async () => {
    const mockDispatch = jest.fn();
    const thunk = actions.fetchMyPosts(DUMMY_USER_STORE);
    const mockQuery = jest
      .fn()
      .mockResolvedValue({ data: { user: { posts: DUMMY_POSTS } } });
    // @ts-ignore
    ApolloClient.mockImplementation(() => {
      return { query: mockQuery };
    });
    await thunk(mockDispatch);

    const { variables } = mockQuery.mock.calls[0][0];

    expect(variables.userId).toBe(DUMMY_USER_STORE.userId);
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: types.FETCH_MY_POSTS_SUCCESS,
      payload: DUMMY_POSTS,
    });
  });

  test('do nothing if userId is not provided', async () => {
    fetch.mockResponse();

    const mockDispatch = jest.fn();
    const thunk = actions.fetchMyPosts({ ...DUMMY_USER_STORE, userId: '' });
    await thunk(mockDispatch);

    expect(fetch).not.toBeCalled();
  });

  test('make a correct action if test failed', async () => {
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

describe('changeFilterCriterion', () => {
  test('makes correct action when success', async () => {
    const dummyCriterion = { a: 1, b: 0, c: 0 };
    const dummyCriterionUntouched = { a: 0, b: 0, c: 0 };

    const thunk = actions.changeFilterCriterion(
      dummyCriterion,
      dummyCriterionUntouched,
    );
    const mockDispatch = jest.fn();
    await thunk(mockDispatch);

    expect(mockDispatch).toBeCalledWith({
      type: types.CHANGE_FILTER_CRITERION_SUCCESS,
      payload: { a: 1 },
    });
  });
});

describe('clearFilterCriterion', () => {
  test('makes correct action', () => {
    const action = actions.clearFilterCriterion();
    expect(action).toEqual({
      type: types.CLEAR_FILTER_CRITERION_SUCCESS,
    });
  });
});

describe('getFilterSelectorRange', () => {
  test('makes correct action when success', async () => {
    const dummyResponse = { a: 1 };
    fetch.mockResponse(JSON.stringify(dummyResponse));
    const thunk = actions.getFilterSelectorRange();
    const mockDispatch = jest.fn();
    await thunk(mockDispatch);

    expect(mockDispatch).toBeCalledWith({
      type: types.GET_FILTER_SELECTOR_RANGE_SUCCESS,
      payload: dummyResponse,
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
      payload: DUMMY_POST_ID,
    });
  });

  test('makes correct action when fail', async () => {
    fetch.mockReject();
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[0][0].type).toBe(types.CREATE_COMMENT_FAIL);
    expect(mock.dispatch.mock.calls[0][0]).toHaveProperty('payload');
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
      payload: DUMMY_COMMENT.postId,
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
      payload: DUMMY_POSTS[0].postId,
    });
  });

  test('makes correct action when fail', async () => {
    fetch.mockReject();
    await thunk(mock.dispatch);

    expect(mock.dispatch.mock.calls[0][0].type).toBe(types.TOGGLE_LIKE_FAIL);
    expect(mock.dispatch.mock.calls[0][0]).toHaveProperty('payload');
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

describe('saveMapZoomAndCenter', () => {
  test('make a correct action', () => {
    const action = actions.saveMapZoomAndCenter('dummy');
    expect(action).toEqual({
      type: types.SAVE_MAP_ZOOM_AND_CENTER,
      payload: 'dummy',
    });
  });
});

describe('openDialog', () => {
  test('make a correct action', () => {
    const action = actions.openDialog('dummy');
    expect(action).toEqual({
      type: types.OPEN_DIALOG,
      payload: 'dummy',
    });
  });
});

describe('closeDialog', () => {
  test('make a correct action', () => {
    const action = actions.closeDialog('dummy');
    expect(action).toEqual({
      type: types.CLOSE_DIALOG,
    });
  });
});
