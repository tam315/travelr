import actions from '../index';
import types from '../types';

const DUMMY_USER_STORE = {
  userId: 'aa',
  displayName: 'bb',
  isAdmin: false,
  token: 'cc',
};

const DUMMY_MY_POSTS_BY_API = [
  {
    postId: 1,
    oldImageUrl: 'dummy_oldImageUrl',
    newImageUrl: 'dummy_newImageUrl',
    description: 'dummy_description',
    shootDate: '1999-09-09',
    lng: 'dummy_lng',
    lat: 'dummy_lat',
    viewCount: 100,
    displayName: 'dummy_displayName',
    likedCount: 101,
    commentsCount: 102,
    comments: [
      {
        commentId: 123,
        userId: 456,
        datetime: new Date('1985-03-31').toISOString(),
        comment: 'dummy_comment',
      },
    ],
  },
  {
    postId: 2,
    oldImageUrl: 'dummy_oldImageUrl',
    newImageUrl: 'dummy_newImageUrl',
    description: 'dummy_description',
    shootDate: '1999-09-09',
    lng: 'dummy_lng',
    lat: 'dummy_lat',
    viewCount: 200,
    displayName: 'dummy_displayName',
    likedCount: 201,
    commentsCount: 202,
    comments: [
      {
        commentId: 123,
        userId: 456,
        datetime: new Date('1985-03-31').toISOString(),
        comment: 'dummy_comment',
      },
    ],
  },
];

const DUMMY_POSTS_IDS = DUMMY_MY_POSTS_BY_API.map(post => post.postId);

beforeEach(() => {
  fetch.resetMocks();
});

describe('actions', () => {
  describe('fetchAllPosts', () => {
    test('generates correct url', async () => {
      const criterion = {
        userId: 'dummy_userId',
        displayName: 'dummy_displayName',
        description: 'dummy_description',
        minDate: 'dummy_minDate',
        maxDate: 'dummy_maxDate',
        lng: 'dummy_lng',
        lat: 'dummy_lat',
        radius: 'dummy_radius',
        minViewCount: 'dummy_minViewCount',
        maxViewCount: 'dummy_maxViewCount',
        minLikedCount: 'dummy_minLikedCount',
        maxLikedCount: 'dummy_maxLikedCount',
        minCommentsCount: 'dummy_minCommentsCount',
        maxCommentsCount: 'dummy_maxCommentsCount',
        limit: 'dummy_limit',
      };

      const thunk = actions.fetchAllPosts(criterion);
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      expect(fetch.mock.calls[0][0]).toContain(
        '/posts?' +
          'user_id=dummy_userId' +
          '&display_name=dummy_displayName' +
          '&description=dummy_description' +
          '&min_date=dummy_minDate' +
          '&max_date=dummy_maxDate' +
          '&lng=dummy_lng' +
          '&lat=dummy_lat' +
          '&radius=dummy_radius' +
          '&min_view_count=dummy_minViewCount' +
          '&max_view_count=dummy_maxViewCount' +
          '&min_liked_count=dummy_minLikedCount' +
          '&max_liked_count=dummy_maxLikedCount' +
          '&min_comments_count=dummy_minCommentsCount' +
          '&max_comments_count=dummy_maxCommentsCount' +
          '&limit=dummy_limit',
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

  describe('fetchUserInfo', () => {
    test('generates correct url', async () => {
      fetch.mockResponse();

      const DUMMY_TOKEN = 'dummy_token';

      const thunk = actions.fetchUserInfo(DUMMY_TOKEN);
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      const fetchUrl = fetch.mock.calls[0][0];
      const fetchOptions = fetch.mock.calls[0][1];
      expect(fetchUrl).toContain('/users/token');
      expect(fetchOptions.headers.authorization).toBe(DUMMY_TOKEN);
    });

    test('makes correct action when success', async () => {
      const DUMMY_TOKEN = 'dummy_token';
      const DUMMY_RESPONSE = {
        userId: 'aa',
        displayName: 'bb',
        isAdmin: false,
        token: DUMMY_TOKEN,
        earnedLikes: 1,
        earnedComments: 2,
        earnedViews: 3,
      };

      fetch.mockResponse(JSON.stringify(DUMMY_RESPONSE));

      const thunk = actions.fetchUserInfo(DUMMY_TOKEN);
      const mockDispatch = jest.fn();
      await thunk(mockDispatch);

      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.FETCH_USER_INFO_SUCCESS,
        payload: DUMMY_RESPONSE,
      });
    });

    test('makes correct action when fail', async () => {
      fetch.mockReject();

      const DUMMY_TOKEN = 'dummy_token';

      const thunk = actions.fetchUserInfo(DUMMY_TOKEN);
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
    const DUMMY_USER = {
      userId: 'aa',
      displayName: 'bb',
      isAdmin: false,
      token: 'cc',
    };

    test('make a correct fetch and action if success', async () => {
      fetch.mockResponse();

      const mockCallback = jest.fn();
      const mockDispatch = jest.fn();
      const thunk = actions.deleteUser(DUMMY_USER, mockCallback);
      await thunk(mockDispatch);

      const fetchUrl = fetch.mock.calls[0][0];
      const fetchOptions = fetch.mock.calls[0][1];

      // make a correct fetch
      expect(fetchUrl).toContain(`/users/${DUMMY_USER.userId}`);
      expect(fetchOptions.headers.authorization).toBe(DUMMY_USER.token);
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
      const thunk = actions.deleteUser(DUMMY_USER, mockCallback);
      await thunk(mockDispatch);

      // make a correct action
      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.DELETE_USER_FAIL,
      });

      // callback shouldn't called
      expect(mockCallback).not.toBeCalled();
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
      fetch.mockResponse(JSON.stringify(DUMMY_MY_POSTS_BY_API));

      const mockDispatch = jest.fn();
      const thunk = actions.fetchMyPosts(DUMMY_USER_STORE);
      await thunk(mockDispatch);

      // make a correct action
      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.FETCH_MY_POSTS_SUCCESS,
        payload: DUMMY_MY_POSTS_BY_API,
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

  describe('deleteMyPosts', () => {
    test('generate a correct url', async () => {
      fetch.mockResponse();

      const mockDispatch = jest.fn();
      const thunk = actions.deleteMyPosts(DUMMY_USER_STORE, DUMMY_POSTS_IDS);
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
      const thunk = actions.deleteMyPosts(DUMMY_USER_STORE, DUMMY_POSTS_IDS);
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
      const thunk = actions.deleteMyPosts(DUMMY_USER_STORE, DUMMY_POSTS_IDS);
      await thunk(mockDispatch);

      // make a correct action
      expect(mockDispatch.mock.calls[0][0]).toEqual({
        type: types.DELETE_MY_POSTS_FAIL,
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
});
