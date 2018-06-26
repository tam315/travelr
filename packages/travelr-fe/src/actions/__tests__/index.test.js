import actions from '../index';
import types from '../types';

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
});
